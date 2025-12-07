import { DOCUMENT, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmsFormQuestionComponent } from '../cms-form-question/cms-form-question.component';

import { toggleVertically } from '@app/animations';
import { CmsService } from '@app/services/cms.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { ICmsForm, IFormFieldValue } from '@app/services/models/cms/forms/cms-form';
import { CmsFormQuestion } from '@app/services/models/cms/forms/cms-form-question';
import { CmsFormset } from '@app/services/models/cms/forms/cms-formset';
import { IFeatureFlag } from '@app/services/models/feature-flag';
import { SeoService } from '@app/services/seo.service';
import { atLeastOneCheckboxSelected, checkboxInputRegex, radioInputRegex } from '@app/shared/form-validators/form-array.validators';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';


/**
 * Survey form component
 */
@Component({
    selector: 'cms-form',
    templateUrl: './cms-form.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor, CmsFormQuestionComponent, NgClass, TranslatePipe, SanitizeHtmlPipe]
})
export class CmsFormComponent implements OnInit, OnDestroy {

    /**
     * Survey page (json)
     */
    @Input() cmsFormPage: ICmsForm;

    /**
     * Survey form
     */
    form: UntypedFormGroup;

    /**
     * Is form successfully submitted
     */
    isFormSubmitted = false;

    /**
     * Occurrence an error during form submitting
     */
    submitError = false;

    /**
     * Survey payload
     */
    payLoad = {};

    /**
     * List of formsetObjects built for formsets
     */
    formsetObjects: any = [];

    /**
     * Should be serialized to object flag
     * @type {boolean}
     */
    private shouldBeSerializedToObject: boolean;

    /**
     * Cleanup subject
     * @type {Subject<void>}
     */
    private destroy$: Subject<void> = new Subject<void>();

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                @Inject(DOCUMENT) private document: Document,
                private cmsService: CmsService,
                private featureFlagService: FeatureFlagService) {
    }

    /**
     * Build formsetObjects and formGroup
     */
    ngOnInit() {
        if (this.cmsFormPage?.title) {
            this.seoService.setPageTitle([this.cmsFormPage?.title]);
        } else {
            this.seoService.setPageTitleByTranslationKey(['Cms.FillOutSurvey']);
        }
        this.setupSerializationReturnType();

        this.cmsFormPage.formsets.forEach((formset) => this.formsetObjects.push(new CmsFormset(formset)));
        this.form = this.toFormGroup(this.formsetObjects);
    }

    /**
     * Setups serialization return type
     */
    private setupSerializationReturnType() {
        this.featureFlagService.featureFlags
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (flagList: IFeatureFlag[]) => {
                    this.shouldBeSerializedToObject = this.featureFlagService.validateFlag('S15_survey_send_object.fe', flagList);
                }
            );
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    /**
     * Build payload and send to CMS
     */
    onSubmit() {
        this.submitError = false;
        this.setPayload(this.form.controls);

        this.cmsService.sendForm(this.cmsFormPage.meta.detail_url, this.payLoad).subscribe(
            () => this.isFormSubmitted = true,
            () => this.submitError = true);
    }

    /**
     * Creates form controls for questions and return it
     * @param {CmsFormset[]} formsets
     * @return FormGroup
     */
    private toFormGroup(formsets: CmsFormset[]): UntypedFormGroup {
        const group = {};

        formsets.forEach(formsetQuestion => {
            if (!formsetQuestion.answerOptions.length) {
                return;
            }

            this.setQuestionType(formsetQuestion);
            let defaultValue;

            if (formsetQuestion.questionType === 'checkbox') {
                const answersArray = formsetQuestion.answerOptions.map(answer => {

                    if (answer.hasTextInput || answer.hasMultilineInput) {
                        defaultValue = null;
                    } else {
                        defaultValue = answer.value.checked ? this.getDefaultValue(answer) : false;
                    }

                    return new UntypedFormControl(defaultValue);
                });
                group[formsetQuestion.name] = this.buildFormControl(answersArray, formsetQuestion.required);
            } else if (formsetQuestion.questionType === 'radio') {
                const checkedAnswer = formsetQuestion.answerOptions.find(answer => answer.value.checked);
                defaultValue = checkedAnswer ? this.getDefaultValue(checkedAnswer) : '';
                group[formsetQuestion.name] = this.buildFormControl(defaultValue, formsetQuestion.required);
            } else {
                defaultValue = this.getDefaultValue(formsetQuestion.answerOptions[0]);
                group[formsetQuestion.name] = this.buildFormControl(defaultValue, formsetQuestion.required);
            }
        });

        return new UntypedFormGroup(group);
    }

    /**
     * Gets default value from answer.
     * @param {CmsFormQuestion} answer
     * @return {string}
     */
    private getDefaultValue(answer: CmsFormQuestion): string {
        return answer.value.value ? answer.value.value : answer.value.input_default_value;
    }

    /**
     * Build FormControl or FormArray object
     * @param {string | AbstractControl[]} defaultValue
     * @param {boolean} isRequired
     * @return {FormControl | FormArray}
     */
    private buildFormControl(defaultValue: string | AbstractControl[], isRequired: boolean): UntypedFormControl | UntypedFormArray {
        return Array.isArray(defaultValue) ?
            new UntypedFormArray(defaultValue, isRequired ? atLeastOneCheckboxSelected : null)
            : new UntypedFormControl(defaultValue, isRequired ? [Validators.required] : null);
    }

    /**
     * Sets the type of question based on the type of its first answer.
     * @param {CmsFormset} formset
     */
    private setQuestionType(formset: CmsFormset) {

        if (!formset.fields && !formset.fields.length) {
            return;
        }

        const questionType = formset.fields[0].type;

        if (questionType && radioInputRegex.test(questionType)) {
            formset.questionType = 'checkbox';
        }
        if (questionType && checkboxInputRegex.test(questionType)) {
            formset.questionType = 'radio';
        }
    }

    /**
     * Sets payload object with proper form values
     * @param {[key: string]: AbstractControl} controls
     */
    private setPayload(controls: { [key: string]: AbstractControl }) {

        for (const name in controls) {
            if (Array.isArray(controls[name].value)) {
                this.payLoad[name] = this.shouldBeSerializedToObject ? this.mapTruthinessToValueObject(controls[name].value, name) :
                    this.mapTruthinessToValueArray(controls[name].value, name);
            } else {
                this.payLoad[name] = controls[name].value;
            }
        }
    }

    /**
     * Sets value for checkbox option if checkbox is selected
     * @param {(boolean | string)[]} controlValues
     * @param {string} controlName
     * @returns {{[p: string]: string | boolean}}
     */
    private mapTruthinessToValueObject(controlValues: (boolean | string)[], controlName: string): { [key: string]: string | boolean } {
        const formset = this.formsetObjects.find(el => el.name === controlName);
        const mappedValues: { [key: string]: string | boolean } = {};
        let answerValue: string;

        controlValues.forEach((el, index) => {
            const {id, value} = formset.answerOptions[index];
            answerValue = value.value ? value.value :
                value.input_default_value ? value.input_default_value : '';

            if (!el || el.toString() !== 'true') {
                mappedValues[id] = el;
            } else {
                mappedValues[id] = answerValue;
            }
        });
        return mappedValues;
    }

    /**
     * Sets value for checkbox option if checkbox is selected
     * @param {(boolean | string)[]} controlValues
     * @param {string} controlName
     * @return {(string | boolean)[]}
     */
    private mapTruthinessToValueArray(controlValues: (boolean | string)[], controlName: string): (string | boolean)[] {
        const formset = this.formsetObjects.find( el => el.name === controlName);
        const mappedValues: (string | boolean)[] = [];
        let answerObject: IFormFieldValue;
        let answerValue: string;

        controlValues.forEach( (el, index) => {
            if (!el || el.toString() !== 'true') {
                mappedValues.push(el);
            } else {
                answerObject = formset.answerOptions[index].value;
                answerValue = answerObject.value ? answerObject.value :
                    answerObject.input_default_value ? answerObject.input_default_value : '';
                mappedValues.push(answerValue);
            }
        });
        return mappedValues;
    }
}

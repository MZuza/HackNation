import { DOCUMENT, LowerCasePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations';
import { CmsFormset } from '@app/services/models/cms/forms/cms-formset';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * CMS form question component
 */
@Component({
    selector: 'cms-form-question',
    templateUrl: './cms-form-question.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NgIf,
      NgClass,
      NgFor,
      NgSwitch,
      NgSwitchCase,
      LowerCasePipe,
      TranslatePipe,
      SanitizeHtmlPipe
    ]
})
export class CmsFormQuestionComponent {

    /**
     * Form question object do display
     */
    @Input() formset: CmsFormset;

    /**
     * Form group
     */
    @Input() form: UntypedFormGroup;

    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    /**
     * Select checkbox and radiobutton automatically when user starts to write in input field
     * @param {string} answerControlName
     * @param {string} questionControlName
     */
    checkControl(answerControlName: string, questionControlName: string = null) {
        const elementToSelect: HTMLInputElement =  <HTMLInputElement>this.document.getElementById(answerControlName);
        elementToSelect.checked = true;

        if (questionControlName) {
            this.radioChanged(answerControlName, questionControlName);
        }
    }

    /**
     * Select checkbox and radiobutton automatically when user starts to write in input field
     * @param {string} answerControlName
     * @param {string} questionControlName
     */
    radioChanged(answerControlName: string, questionControlName: string) {
        let radioValue = '';
        const radioInputElement = <HTMLInputElement>this.document.getElementById(questionControlName + answerControlName);
        const answerValueObject = this.formset.answerOptions.find(answer => answer.id === answerControlName).value;

        if (radioInputElement) {
            radioValue = radioInputElement.value ? radioInputElement.value : answerValueObject.input_default_value;
        }
        if (!radioInputElement) {
            radioValue = answerValueObject.value;
        }

        this.form.controls[questionControlName].setValue(radioValue);
    }
}

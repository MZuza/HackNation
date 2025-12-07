import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleCommentsComponent } from '../../components/schedule-comments/schedule-comments.component';
import { PlanningFormBlueprint } from '../../tabs/planning/domain/schedule';
import { SchedulePlanningService } from '../../tabs/planning/schedule-planning.service';
import { ScheduleCustomDropdownDirective } from '../schedule-custom-dropdown.directive';
import { ScheduleStage } from '../schedule-stage';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { ObjectHelper } from '@app/shared/helpers';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

@Component({
    selector: 'app-schedule-planning-form',
    templateUrl: './schedule-planning-form.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, NotificationsServerComponent, NgClass, ScheduleCustomDropdownDirective, NgFor, ScheduleCommentsComponent]
})
export class SchedulePlanningFormComponent implements OnInit {

    /**
     * Planning form
     */
    planningForm: UntypedFormGroup;

    /**
     * Institution list - temp all possible
     */
    institutions: { id: string, title: string }[];

    /**
     * Format list
     */
    formats: { id: string, title: string }[];

    /**
     * Yes/No list
     */
    yes_no = [
        {name: 'Tak', value: true},
        {name: 'Nie', value: false}
    ];

    /**
     * TEMP
     */
    recommendations = [
        {name: 'Rekomendowane', value: 'recommended'},
        {name: 'Nierekomendowane', value: 'not_recommended'},
        {name: 'Oczekuje na rekomendację', value: 'awaits'}
    ];

    /**
     * TEMP
     */
    acceptance = [
        {name: 'Akceptacja', value: true},
        {name: 'Brak akceptacji', value: false},
    ];

    /**
     * TEMP
     */
    realization = [
        {name: 'Zgłoszenie zostało zrealizowane', value: true},
        {name: 'Zgłoszenie nie zostało zrealizowane', value: false}
    ];

    /**
     * Current stage (planning, realization, archive)
     */
    currentStage: ScheduleStage;

    /**
     * Determines whether form is in edit mode
     */
    isEditMode: boolean;

    /**
     * Determines whether form is in admin view
     */
    isAdminView: boolean;

    /**
     * Determines whether institution expanded is
     */
    isInstitutionDropdownExpanded = false;

    /**
     * Determines whether institution unit expanded is
     */
    isInstitutionUnitDropdownExpanded = false;

    /**
     * Determines whether format expanded is
     */
    isFormatDropdownExpanded = false;

    /**
     * Planning form blueprint
     */
    planningFormBlueprint: PlanningFormBlueprint;

    /**
     * Form submit section visibility flag
     */
    isSubmitShouldBeVisible: boolean = true;

    /**
     * User (representative) email
     */
    email: string;

    /**
     * Link pattern
     */
    linkPattern = '^(https?)[^/]+(/.*)/[^/]+$';

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private userStateService: UserStateService,
                private schedulePlanningService: SchedulePlanningService,
                private scheduleService: ScheduleService,
                private notificationsFrontService: NotificationsFrontService,
                private router: Router) {
    }

    /**
     * Sets up the form and its data
     */
    ngOnInit() {
        this.setupBase();
        this.prepareForm();
    }

    /**
     * Updates recommendation validators
     */
    updateRecommendationValidators() {
        const {recommendation_state, recommendation_notes} = this.planningForm.controls['recommendation_group']['controls'];
        recommendation_notes.clearValidators();

        if (recommendation_state.value === this.recommendations[1].value) {
            recommendation_notes.setValidators(Validators.required);
        }

        recommendation_notes.updateValueAndValidity();
    }

    /**
     * Updates acceptance validators
     */
    updateAcceptanceValidators() {
        const {is_accepted, recommendation_notes} = this.planningForm.controls['acceptance_group']['controls'];
        recommendation_notes.clearValidators();

        if (is_accepted.value === this.acceptance[1].value) {
            recommendation_notes.setValidators(Validators.required);
        }

        recommendation_notes.updateValueAndValidity();
    }

    /**
     * Updates realization validators
     */
    updateRealizationValidators() {
        const {is_resource_added, resource_link, is_resource_added_notes} = this.planningForm.controls['realization_group']['controls'];

        resource_link.clearValidators();
        is_resource_added_notes.clearValidators();

        if (is_resource_added.value) {
            resource_link.setValidators([Validators.required, Validators.pattern(this.linkPattern)]);
        } else {
            resource_link.setValidators(Validators.pattern(this.linkPattern));
            is_resource_added_notes.setValidators(Validators.required);
        }

        resource_link.updateValueAndValidity();
        is_resource_added_notes.updateValueAndValidity();
    }

    /**
     * Reads dataset chosen from autocomplete dropdown menu
     * @param {any} dataset
     * @param {number} index
     */
    onCustomDropdownItemSelected(value: string, formControl: string) {
        this.planningForm.patchValue({[formControl]: value});
    }

    /**
     * Enables/sisables is_new related fields
     */
    checkIsNewValue() {
        const {is_openness_score_increased, is_quality_improved, is_new} = this.planningForm.controls;

        if (is_new.value !== false || is_new.disabled) {
            is_openness_score_increased.disable();
            is_quality_improved.disable();
            this.clearIsNewRelatedFieldsValidators();

            if (!is_new.disabled) {
                this.resetIsNewRelatedFields();
            }
        } else {
            is_openness_score_increased.enable();
            is_quality_improved.enable();

            this.setIsNewRelatedFieldsValidators();
            this.checkIsNewRelatedFieldsValidators();
        }

        this.updateIsNewRelatedFieldsValidity();
    }

    /**
     * Checks is_new related fields validators
     */
    checkIsNewRelatedFieldsValidators() {
        const {is_openness_score_increased, is_quality_improved} = this.planningForm.controls;

        if (is_openness_score_increased.valid && is_quality_improved.valid) {
            if (is_openness_score_increased.value === false && is_quality_improved.value === false) {
                setTimeout(() => {
                    is_openness_score_increased.setErrors({invalid: true});
                    is_quality_improved.setErrors({invalid: true});
                });
            } else {
                is_openness_score_increased.setErrors(null);
                is_quality_improved.setErrors(null);
            }
        }

        this.updateIsNewRelatedFieldsValidity();
    }

    /**
     * Submits the form
     */
    onFormSubmit() {
        if (this.planningForm.invalid) {
            return;
        }

        const flattenedFormValue = ObjectHelper.flattenNestedObjects(this.planningForm.value);
        let newFormValue = {...this.planningForm.value};
        newFormValue = {...flattenedFormValue};

        // edit schedule item
        if (this.isEditMode) {
            const planningFormBlueprint = {
                id: this.planningFormBlueprint.id,
                ...newFormValue
            };

            this.schedulePlanningService
                .updateUserScheduleItem(planningFormBlueprint)
                .subscribe(() => {
                    this.backToList('Zmiany zostały zapisane');
                });
        } else {

            // admin view
            if (this.isAdminView) {
                const id = this.activatedRoute.snapshot.params['representativeId'];

                if (this.currentStage === ScheduleStage.PLANNING) {
                    const planningFormBlueprint = {
                        agent_id: id,
                        ...newFormValue
                    };

                    this.schedulePlanningService
                        .addUserScheduleItemByAdmin(planningFormBlueprint)
                        .subscribe(() => {
                            this.backToList('Zgłoszenie zostało zapisane');
                        });
                } else {
                    const planningFormBlueprint = {
                        user_schedule_id: id,
                        ...newFormValue
                    };

                    this.scheduleService
                        .addUserScheduleItemByAdmin(planningFormBlueprint)
                        .subscribe(() => {
                            this.backToList('Zgłoszenie zostało zapisane');
                        });
                }

                // representative view
            } else {
                this.schedulePlanningService
                    .addUserScheduleItem(newFormValue)
                    .subscribe(() => {
                        this.backToList('Zgłoszenie zostało zapisane');
                    });
            }
        }
    }

    /**
     * Backs to list
     * @param {string} [message]
     */
    backToList(message?: string) {
        if (this.currentStage === ScheduleStage.PLANNING) {
            this.router.navigate((this.isAdminView && this.isEditMode) ? ['../../'] : ['../'], {relativeTo: this.activatedRoute});
        } else if (this.currentStage === ScheduleStage.REALIZATION || this.currentStage === ScheduleStage.ARCHIVE) {
            this.router.navigate((this.isAdminView && !this.isEditMode) ? ['../'] : ['../../'], {relativeTo: this.activatedRoute});
        }

        this.schedulePlanningService.setTableShouldBeReloaded();

        if (message) {
            this.notificationsFrontService.clearAlerts();
            this.notificationsFrontService.addSuccess(message);
        }
    }

    /**
     * Sets up base view variables
     */
    private setupBase() {
        this.currentStage = this.activatedRoute.parent.snapshot.url[0].path as ScheduleStage;
        this.isEditMode = this.activatedRoute.snapshot.params['userScheduleId'] ? true : false;
        this.isAdminView = this.activatedRoute.snapshot.params['representativeId'] ? true : false;
    }

    /**
     * Initializes form
     */
    private initForm() {
        this.planningForm = new UntypedFormGroup({
            'institution': new UntypedFormControl(null, Validators.required),
            'institution_unit': new UntypedFormControl(''),
            'dataset_title': new UntypedFormControl(null, Validators.required),
            'format': new UntypedFormControl(null, Validators.required),
            'is_new': new UntypedFormControl(null, Validators.required),
            'is_openness_score_increased': new UntypedFormControl(null),
            'is_quality_improved': new UntypedFormControl(null),
            'description': new UntypedFormControl('')
        });
    }

    /**
     * Fills form with data
     */
    private fillForm() {

        // edit mode
        if (this.isEditMode) {
            this.schedulePlanningService
                .getUserScheduleItem(this.activatedRoute.snapshot.params['userScheduleId'])
                .subscribe(response => {
                    this.planningFormBlueprint = response;
                    this.planningForm.patchValue(response);
                    this.email = response.email;
                    this.checkIsNewValue();

                    if (this.currentStage === ScheduleStage.PLANNING) {
                        if (response.is_ready && !this.isAdminView) {
                            this.disableFormGroupFields();
                            this.isSubmitShouldBeVisible = false;
                        }
                        if ((response.is_schedule_blocked || response.is_user_schedule_blocked) && !this.isAdminView) {
                            this.disableFormGroupFields();
                            this.isSubmitShouldBeVisible = false;
                        }
                    }

                    // admin view
                    if (this.isAdminView) {
                        if (this.currentStage === ScheduleStage.PLANNING) {
                            this.fillRecommendationGroup(response);
                            this.updateRecommendationValidators();
                        }
                    }

                    if (this.currentStage !== ScheduleStage.PLANNING) {
                        this.fillAcceptanceGroup(response);
                        this.updateAcceptanceValidators();

                        this.fillRealizationGroup(response);
                        this.updateRealizationValidators();
                    }

                    if (!this.isAdminView && this.currentStage === ScheduleStage.REALIZATION) {
                        if (!response['is_accepted']) {
                            this.disableFormGroupFields();
                        }
                    }

                    this.schedulePlanningService.getUserInstitutions(this.planningFormBlueprint.user_id).subscribe(institutions => {
                        this.institutions = institutions;
                    });
                });
        } else {

            // admin view
            if (this.isAdminView) {

                if (this.currentStage === ScheduleStage.REALIZATION) {
                    this.fillAcceptanceGroup({is_accepted: false});
                    this.updateAcceptanceValidators();
                    this.fillRealizationGroup({is_resource_added: false});
                    this.updateRealizationValidators();
                }

                if (this.currentStage === ScheduleStage.PLANNING) {
                    this.schedulePlanningService
                        .getUserInstitutionsForScheduleItem(this.activatedRoute.snapshot.params['representativeId'])
                        .subscribe(response => {
                            if (response.institutions) {
                                this.institutions = response.institutions;
                                this.email = response.email;
                                this.planningForm.patchValue({institution: this.institutions[0].title});
                            }
                        });
                } else {
                    this.schedulePlanningService
                        .getUserInstitutionsForScheduleItemId(this.activatedRoute.snapshot.params['representativeId'])
                        .subscribe(response => {
                            if (response.institutions) {
                                this.institutions = response.institutions;
                                this.email = response.email;
                                this.planningForm.patchValue({institution: this.institutions[0].title});
                            }
                        });
                }
            } else {
                this.userStateService.getCurrentUser().subscribe(user => {
                    if (user?.agent_institutions) {
                        this.institutions = user.agent_institutions;
                        this.planningForm.patchValue({institution: this.institutions[0].title});
                    }
                });
            }
        }

        this.userService.getFormats().subscribe(formats => this.formats = formats);
    }

    /**
     * Prepares the form base on the current stage
     */
    private prepareForm() {
        this.initForm();

        switch (this.currentStage) {
            case ScheduleStage.PLANNING:

                if (this.isAdminView && this.isEditMode) {
                    this.attachRecommendationGroup();
                }
                break;

            case ScheduleStage.REALIZATION:
                this.attachAcceptanceGroup();

                if (!this.isAdminView) {
                    this.disableFormGroupFields();
                }
                this.attachRealizationGroup();
                break;

            case ScheduleStage.ARCHIVE:
                this.attachAcceptanceGroup();
                this.attachRealizationGroup();

                if (!this.isAdminView) {
                    this.disableFormGroupFields();
                    this.isSubmitShouldBeVisible = false;
                }
                break;
        }

        this.fillForm();
    }

    /**
     * Disables form group fields
     * @param {FormGroup} formGroup
     */
    private disableFormGroupFields(formGroup = this.planningForm) {
        Object.keys(formGroup.controls).forEach(key => {
            formGroup.controls[key].disable();

            if (formGroup.controls[key] instanceof UntypedFormGroup) {
                this.disableFormGroupFields(formGroup.controls[key] as UntypedFormGroup);
            }
        });
    }

    /**
     * Attaches recommendation group fields
     */
    private attachRecommendationGroup() {
        const group = new UntypedFormGroup({
            'recommendation_state': new UntypedFormControl(),
            'recommendation_notes': new UntypedFormControl(null)
        });

        this.planningForm.addControl('recommendation_group', group);
    }

    /**
     * Fills recommendation group fields
     */
    private fillRecommendationGroup(fieldsData: any) {
        if (this.planningForm.get('recommendation_group')) {
            this.planningForm.get('recommendation_group').patchValue(fieldsData);
        }
    }

    /**
     * Attaches acceptance group fields
     */
    private attachAcceptanceGroup() {
        const group = new UntypedFormGroup({
            'is_accepted': new UntypedFormControl(),
            'recommendation_notes': new UntypedFormControl(null)
        });

        this.planningForm.addControl('acceptance_group', group);
    }

    /**
     * Fills recommendation group fields
     */
    private fillAcceptanceGroup(fieldsData: any) {
        if (this.planningForm.get('acceptance_group')) {
            this.planningForm.get('acceptance_group').patchValue(fieldsData);
        }
    }

    /**
     * Attaches realization group fields
     */
    private attachRealizationGroup() {
        const group = new UntypedFormGroup({
            'is_resource_added': new UntypedFormControl(),
            'resource_link': new UntypedFormControl(null, [Validators.required, Validators.pattern(this.linkPattern)]),
            'is_resource_added_notes': new UntypedFormControl(null)
        });

        this.planningForm.addControl('realization_group', group);
    }

    /**
     * Fills recommendation group fields
     */
    private fillRealizationGroup(fieldsData: any) {
        if (this.planningForm.get('realization_group')) {
            this.planningForm.get('realization_group').patchValue(fieldsData);
        }
    }

    /**
     * Clears is_new related fields validators
     */
    private clearIsNewRelatedFieldsValidators() {
        const {is_openness_score_increased, is_quality_improved} = this.planningForm.controls;

        is_openness_score_increased.clearValidators();
        is_quality_improved.clearValidators();
    }

    /**
     * Sets is_new related fields validators
     */
    private setIsNewRelatedFieldsValidators() {
        const {is_openness_score_increased, is_quality_improved} = this.planningForm.controls;

        is_openness_score_increased.setValidators(Validators.required);
        is_quality_improved.setValidators(Validators.required);
    }

    /**
     * Updates is_new related fields validity
     */
    private updateIsNewRelatedFieldsValidity() {
        const {is_openness_score_increased, is_quality_improved} = this.planningForm.controls;

        is_openness_score_increased.updateValueAndValidity();
        is_quality_improved.updateValueAndValidity();
    }

    /**
     * Resets is_new related fields
     */
    private resetIsNewRelatedFields() {
        this.planningForm.patchValue({
            is_openness_score_increased: null,
            is_quality_improved: null
        });
    }
}

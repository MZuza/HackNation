import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { plLocale } from 'ngx-bootstrap/locale';
import { ScheduleSettingsService } from '../../services/schedule-settings.service';
import { Schedule, ScheduleSettings } from '../../tabs/planning/domain/schedule';

import { toggleVertically } from '@app/animations';
import { NotificationsService } from '@app/services/notifications.service';
import { DatepickerComponent } from '@app/shared/datepicker/datepicker.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

defineLocale('pl', plLocale);

@Component({
    selector: 'app-schedule-settings-form',
    templateUrl: './schedule-settings-form.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [
      NgIf,
      FormsModule,
      ReactiveFormsModule,
      NotificationsServerComponent,
      TooltipDirective,
      NgClass,
      DatepickerComponent,
      TranslatePipe
    ]
})
export class ScheduleSettingsFormComponent implements OnInit, OnChanges {

    /**
     * Schedule
     * @type {Schedule}
     */
    @Input()
    schedule: Schedule;

    /**
     * Schedule settings updated
     * @type {EventEmitter<ScheduleSettings>}
     */
    @Output()
    scheduleSettingsUpdated: EventEmitter<ScheduleSettings> = new EventEmitter<ScheduleSettings>();

    /**
     * Date picker config
     */
    datePickerConfig = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-dark-blue'
    };

    /**
     * Settings form
     */
    settingsForm: UntypedFormGroup;

    /**
     * Determines whether form is submitted
     */
    isFormSubmitted = false;

    /**
     * Schedule settings
     */
    scheduleSettings: ScheduleSettings;

    /**
     * Determines whether end_date is enabled
     */
    isEndDateEnabled = true;

    /**
     * Determines whether new_end_date is enabled
     */
    isNewEndDateEnabled = true;

    /**
     * Determines if only link filed should be editable
     * @type {boolean}
     */
    isOnlyLinkEditable: boolean;

    /**
     * @ignore
     */
    constructor(private bsLocaleService: BsLocaleService,
                private scheduleSettingsService: ScheduleSettingsService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Inits and fills the form
     */
    ngOnInit(): void {
        this.bsLocaleService.use('pl');
        this.initForm();
    }

    /**
     * Updates form value when schedule change
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!changes.schedule.firstChange && changes.schedule.previousValue !== changes.schedule.currentValue) {
            this.initForm();
        }
    }

    /**
     * Inits the form
     */
    initForm() {
        this.isOnlyLinkEditable = this.schedule.state !== 'planned';

        this.settingsForm = new UntypedFormGroup({
            'period_name': new UntypedFormControl(this.schedule.periodName, this.isOnlyLinkEditable ? undefined : Validators.required),
            'end_date': new UntypedFormControl(this.schedule.planningEndDate),
            'new_end_date': new UntypedFormControl(this.schedule.newPlanningEndDate),
            'link': new UntypedFormControl(this.schedule.link, Validators.pattern('^(https?)[^/]+(/.*)/[^/]+$')),
        });
    }

    /**
     * Runs on every end_date change.
     * @param event
     */
    onEndDateChange(event) {
        if (this.isOnlyLinkEditable || (this.isOnlyLinkEditable && !this.isValidDate(event))) {
            this.isNewEndDateEnabled = false;
        } else {
            this.isNewEndDateEnabled = true;
        }
    }

    /**
     * Toggles form
     */
    onToggleForm() {
        this.isFormSubmitted = !this.isFormSubmitted;
        this.initForm();
    }

    /**
     * Submits the form
     */
    onFormSubmit() {
        if (this.settingsForm.invalid) {
            return;
        }

        this.notificationsService.clearAlerts();
        const settingsFormValue = {...this.settingsForm.value};

        if (this.isOnlyLinkEditable || !this.isValidDate(settingsFormValue.end_date)) {
            delete (settingsFormValue.end_date);
        } else {
            settingsFormValue.end_date = this.formatDate(settingsFormValue.end_date);
        }

        if (!this.isNewEndDateEnabled || !this.isValidDate(settingsFormValue.new_end_date)) {
            delete (settingsFormValue.new_end_date);
        } else {
            settingsFormValue.new_end_date = this.formatDate(settingsFormValue.new_end_date);
        }

        const settings: ScheduleSettings = {
            schedule_id: this.schedule.id,
            ...settingsFormValue
        };

        this.scheduleSettingsService
            .updateScheduleSettings(settings, this.isOnlyLinkEditable)
            .subscribe(() => {
                this.settingsForm.reset();
                this.isFormSubmitted = true;
                this.scheduleSettingsUpdated.emit(settings);
            });
    }

    /**
     * Determines whether date is valid
     * @param {string} date
     * @returns {boolean}
     */
    private isValidDate(date: string): boolean {
        return this.convertToMoment(date).isValid();
    }

    /**
     * Converts date string to moment
     * @param {string} date
     * @returns {moment.Moment}
     */
    private convertToMoment(date: string): moment.Moment {
        return moment(date);
    }

    /**
     * Formats date
     * @param {string} date
     * @returns {string}
     */
    private formatDate(date: string): string {
        return moment(date).format(this.datePickerConfig.dateInputFormat);
    }
}

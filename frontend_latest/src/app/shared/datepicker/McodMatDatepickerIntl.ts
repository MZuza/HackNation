import { Injectable } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class McodMatDatepickerIntl extends MatDatepickerIntl {
    /**
     * Calendar Label
     * @type {string}
     */
    calendarLabel: string = this.translateService.instant('Calendar.CalendarLabel');

    /**
     * Next month label
     * @type {string}
     */
    nextMonthLabel: string = this.translateService.instant('Calendar.NextMonthLabel');

    /**
     * Next multi year label
     * @type {string}
     */
    nextMultiYearLabel: string = this.translateService.instant('Calendar.NextMultiYearLabel');

    /**
     * Next year label
     * @type {string}
     */
    nextYearLabel: string = this.translateService.instant('Calendar.NextYearLabel');

    /**
     * Open calendar label
     * @type {string}
     */
    openCalendarLabel: string = this.translateService.instant('Calendar.OpenCalendarLabel');

    /**
     * Previous month label
     * @type {string}
     */
    prevMonthLabel: string = this.translateService.instant('Calendar.PrevMonthLabel');

    /**
     * Previous multi year label
     * @type {string}
     */
    prevMultiYearLabel: string = this.translateService.instant('Calendar.PrevMultiYearLabel');

    /**
     * Previous year label
     * @type {string}
     */
    prevYearLabel: string = this.translateService.instant('Calendar.PrevYearLabel');

    /**
     * Switch to month view label
     * @type {string}
     */
    switchToMonthViewLabel: string = this.translateService.instant('Calendar.SwitchToMonthViewLabel');

    /**
     * Switch to multi year view label
     * @type {string}
     */
    switchToMultiYearViewLabel: string = this.translateService.instant('Calendar.SwitchToMultiYearViewLabel');

    /**
     * @ignore
     */
    constructor(private readonly translateService: TranslateService) {
        super();
    }

    /**
     * Format year range
     * @param start
     * @param end
     * @returns {string}
     */
    formatYearRange(start: string, end: string): string {
        return super.formatYearRange(start, end);
    }
}

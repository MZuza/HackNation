import { LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ListViewFiltersActionButtonsComponent } from '../filters/list-view-action-buttons/list-view-filters-action-buttons.component';
import { InfoTooltipDirective } from '../info-tooltip/info-tooltip.directive';

import { StartEndDateRange } from '@app/services/models/startEndDateRange';

/**
 * Daterange component
 */
@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    standalone: true,
    imports: [
        InfoTooltipDirective,
        NgIf,
        NgClass,
        DatepickerComponent,
        ListViewFiltersActionButtonsComponent,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class DateRangePickerComponent {
    /**
     * is filter body visible
     */
    isCollapsed = false;

    /**
     * start date (from)
     */
    @Input() startDate: Date = null;

    /**
     * end date (to)
     */
    @Input() endDate: Date = null;

    /**
     * title to display
     */
    @Input() titleTranslationKey = 'Attribute.DateRange';

    /**
     * enable apply button
     */
    @Input() enableApply = true;

    /**
     * emits date range values
     */
    @Output() datesChanged = new EventEmitter<StartEndDateRange>();

    /**
     * emits when apply selected
     */
    @Output() applyFilterChanged = new EventEmitter();

    /**
     * invoked when date from or start change. Validate dates and sends updated values
     * @param {Date | null} date
     * @param {boolean} isStartDate
     */
    onDateChange(date: Date | null, isStartDate: boolean = true) {
        if (this.startDate === null && this.endDate === null && date === null) {
            return;
        }

        let startDate, endDate;
        date = moment(date).isValid() ? date : null;
        if (isStartDate) {
            startDate = date;
            endDate = this.validateEndDateWhenStartChange(date);
            startDate = startDate && endDate && moment(startDate).isAfter(endDate, 'day') ? endDate : startDate;
        } else {
            startDate = this.startDate ? new Date(this.startDate) : null;
            endDate = this.validateEndDateWhenEndChange(date);
        }

        this.datesChanged.next({ startDate: startDate, endDate: endDate });
    }

    /**
     * sends apply filter change
     */
    onApplyFilter() {
        this.applyFilterChanged.emit();
    }

    /**
     * when end date changes it needs to be validated and returned
     * 1. when end date is removed, but from date is filled, end date should be filled with todays date
     * 2. when start date is empty and from date is removed, end date should be empty
     * @param {Date | null} endDate
     * @returns { Date | null}
     */
    private validateEndDateWhenEndChange(endDate: Date | null): Date | null {
        if (endDate === null) {
            if (this.startDate) {
                return this.returnTodayOrStartDate();
            }
            return null;
        } else {
            if (this.startDate) {
                if (moment(this.startDate).isAfter(endDate)) {
                    return this.returnTodayOrStartDate();
                }
            }
            return endDate;
        }
    }

    /**
     * returns either today date or start date
     * @returns {Date}
     */
    private returnTodayOrStartDate(): Date {
        const todayDate = new Date();
        return moment(todayDate).isAfter(this.startDate) ? todayDate : this.startDate;
    }

    /**
     * 1. when start date is selected and end date is empty, end date should be filled with todays date
     * 2. when end date is same or after start date, end date should be filled with todays date
     * 3. when end date is before start date, end date should be filled with start date
     * @param {Date | null} startDate
     * @returns {Date | null}
     */
    private validateEndDateWhenStartChange(startDate: Date | null): Date | null {
        let endDate = this.endDate ? new Date(this.endDate) : null;
        if (startDate && !this.endDate) {
            const todayDate = new Date();
            endDate = moment(todayDate).isSameOrAfter(startDate, 'day') ? todayDate : startDate;
        }
        return endDate;
    }
}

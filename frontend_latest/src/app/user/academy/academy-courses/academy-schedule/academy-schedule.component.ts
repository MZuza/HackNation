import { AsyncPipe, DatePipe, NgFor, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { AodCourseScheduleDay } from '@app/user/academy/academy-courses/AodCourseScheduleDay';

/**
 * Academy Schedule Component
 */
@Component({
    selector: 'app-academy-schedule',
    templateUrl: './academy-schedule.component.html',
    standalone: true,
    imports: [
        NgFor,
        AsyncPipe,
        TitleCasePipe,
        DatePipe,
        TranslateDateFormatPipe,
    ],
})
export class AcademyScheduleComponent {
  /**
   * AOD Course schedules grouped by month, related to a course
   */
  @Input() scheduleByMonth: { [key: string]: AodCourseScheduleDay[] };
}

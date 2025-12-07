import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AcademyScheduleComponent } from '../academy-schedule/academy-schedule.component';

import { CollapsibleTextComponent } from '@app/shared/collapsible-text/collapsible-text.component';
import { KeyvalueOrderPipe } from '@app/shared/pipes/keyvalue-order.pipe';
import { AodCourse } from '@app/user/academy/academy-courses/AodCourse';
import { AodCourseScheduleDay } from '@app/user/academy/academy-courses/AodCourseScheduleDay';

/**
 * Academy Course Component
 */
@Component({
    selector: 'app-academy-course',
    templateUrl: './academy-course.component.html',
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        CollapsibleTextComponent,
        NgFor,
        AcademyScheduleComponent,
        TitleCasePipe,
        TranslatePipe,
        KeyvalueOrderPipe,
    ],
})
export class AcademyCourseComponent {
  /**
   * AOD course
   */
  @Input() course: AodCourse;

  /**
   * AOD Course schedules grouped by month, related to all the courses
   */
  @Input('courseSchedulesByMonth') schedulesByMonth: { [key: string]: AodCourseScheduleDay[] };

  /**
   * AOD Course schedules grouped by type without duplicates, related to all the courses
   */
  @Input('courseSchedulesByType') schedulesByType: { [key: string]: string };
}

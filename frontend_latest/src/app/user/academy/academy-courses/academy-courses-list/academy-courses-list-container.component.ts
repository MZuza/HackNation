import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { AcademyCourseComponent } from '../academy-course/academy-course.component';

import { AodCourse } from '@app/user/academy/academy-courses/AodCourse';
import { AodCourseScheduleDay } from '@app/user/academy/academy-courses/AodCourseScheduleDay';
import { AodCourseSession } from '@app/user/academy/academy-courses/AodCourseSession';
import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';

/**
 * Academy Courses List Component
 */
@Component({
    selector: 'app-academy-courses-list-container',
    templateUrl: './academy-courses-list-container.component.html',
    standalone: true,
    imports: [NgFor, AcademyCourseComponent],
})
export class AcademyCoursesListContainerComponent extends UserDashboardListViewBaseComponent implements OnInit {
  /**
   * List of items (courses)
   */
  @Input()
  items: AodCourse[];

  /**
   * Count of items (courses)
   */
  count: number;

  /**
   * AOD Course schedules related to all the courses, based on courses sessions
   */
  schedules: AodCourseScheduleDay[][] = [];

  /**
   * AOD Courses schedules grouped by month,  related to all the courses
   */
  schedulesByMonth: { [key: string]: AodCourseScheduleDay[] }[] = [];

  /**
   * AOD Courses schedules grouped by type without duplicates,  related to all the courses
   */
  schedulesByType: { [key: string]: string }[] = [];

  /**
   * Sets date's locale.
   * Handles route params change.
   */
  ngOnInit() {
    this.transformSessionsIntoSchedules(this.items);
  }

  /**
   * Transforms course's sessions into schedules
   * @param {any} items
   */
  private transformSessionsIntoSchedules(items: AodCourse[]) {
    this.schedules = [];
    this.schedulesByMonth = [];
    this.schedulesByType = [];

    items.forEach(item => {
      const schedule = this.createSchedule(item);
      const scheduleGroup = this.groupSchedulesByMonth(schedule);
      const schedulesByType = this.groupSchedulesByType(schedule);

      this.schedules.push(schedule);
      if (Object.keys(scheduleGroup).length !== 0) {
        this.schedulesByMonth.push(scheduleGroup);
      }
      this.schedulesByType.push(schedulesByType);
    });
  }

  /**
   * Creates schedule item part
   * @param session
   * @param {number} sessionCounter
   * @param {string} date
   * @returns
   */
  private createAodCourseScheduleDay(session: AodCourseSession, sessionCounter: number, date: string): AodCourseScheduleDay {
    const momentDate: moment.Moment = moment(date);

    return {
      type: session.type,
      type_name: session.type_name,
      date: date,
      groupName: momentDate.format('MMMM') + ' ' + momentDate.format('Y'),
      session: sessionCounter,
    };
  }

  /**
   * Creates schedule item
   * @param {AodCourseSession} session
   * @param {number} sessionCounter
   * @returns
   */
  private createScheduleItem(session: AodCourseSession, sessionCounter: number): AodCourseScheduleDay[] {
    const scheduleItem = [];

    scheduleItem.push(this.createAodCourseScheduleDay(session, sessionCounter, session.start));

    if (session.start !== session.end) {
      scheduleItem.push(this.createAodCourseScheduleDay(session, sessionCounter, session.end));
    }

    return scheduleItem;
  }

  /**
   * Creates schedule
   * @param {any} item
   * @returns {AodCourseScheduleDay}
   */
  private createSchedule(item: AodCourse): AodCourseScheduleDay[] {
    const schedule = [];

    item.attributes.sessions.forEach((session: AodCourseSession, index: number) => {
      schedule.push(...this.createScheduleItem(session, index + 1));
    });

    return schedule;
  }

  /**
   * Groups schedules by month
   * @param {AodCourseScheduleDay[]} schedule
   * @returns
   */
  private groupSchedulesByMonth(schedule: AodCourseScheduleDay[]) {
    return schedule.reduce((acc, item) => {
      if (!acc[item.groupName]) {
        acc[item.groupName] = [];
      }

      acc[item.groupName].push(item);

      return acc;
    }, {});
  }

  private groupSchedulesByType(schedule: AodCourseScheduleDay[]) {
    return schedule.reduce((acc, item) => {
      if (!item.type) {
        return acc;
      }

      if (!acc[item.type]) {
        acc[item.type] = item.type_name;
      }

      return acc;
    }, {});
  }
}

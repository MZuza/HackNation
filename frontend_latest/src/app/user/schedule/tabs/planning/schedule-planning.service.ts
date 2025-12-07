import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiConfig } from '@app/services/api';
import { HttpCustomErrorResponse } from '@app/services/models';
import { RestService } from '@app/services/rest.service';
import { PlanningFormBlueprint, Schedule, UserSchedule } from '@app/user/schedule/tabs/planning/domain/schedule';
import { Observable, of, OperatorFunction, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ScheduleTableDataSource } from '../../table/domain/ScheduleTableDataSource';
import { TemplateHelper } from '@app/shared/helpers';
import { ScheduleItemComment } from '@app/user/schedule/components/schedule-comments/schedule-item-comment';

/**
 * Schedule Planning Service
 */
@Injectable({
  providedIn: 'root',
})
export class SchedulePlanningService extends RestService {
  /**
   * Table reload flag
   * @type {Subject<void>}
   */
  private readonly reloadTable$: Subject<void> = new Subject<void>();

  /**
   * Gets user schedule items
   * @param id
   * @returns {Observable<any>}
   */
  getSchedulesItemForCurrentSchedule(id: number | string = 'current'): Observable<any> {
    const apiEndpoint = id === 'current' ? ApiConfig.userSchedules : ApiConfig.scheduleAgents;
    const params = new HttpParams().append('include', 'schedule,user_schedule,user_schedule_item');
    return this.get(`${apiEndpoint}/${id}`, params, true).pipe(
      map(res => this.mapResponseToUserSchedule(res)),
      catchError(this.getScheduleForEmptyCurrentUserSchedule(id)),
    );
  }

  /**
   * Gets schedules per representative
   * @returns {Observable<Schedule>}
   */
  getRepresentativesSchedules(): Observable<Schedule> {
    const params = new HttpParams().append('include', 'agent');
    return this.get(ApiConfig.schedules + '/current', params, true).pipe(
      map(res => this.mapResponseToSchedule(res)),
      this.catch404(),
    );
  }

  /**
   * Gets schedules per representative
   * @returns {Observable<Schedule>}
   */
  getSchedules(): Observable<Array<ScheduleTableDataSource>> {
    return this.get(ApiConfig.schedules, null, true).pipe(
      map(response => response['data']),
      catchError((err: HttpCustomErrorResponse) => {
        if (err.status === 404) {
          return of(null);
        }
        return throwError(err);
      }),
    );
  }

  /**
   * Updates schedule status
   * @param scheduleId
   * @param isCompleted
   * @returns {Observable<any>}
   */
  updateScheduleStatus(scheduleId: number, isCompleted: boolean): Observable<void> {
    const body = {
      data: {
        type: 'user_schedule',
        attributes: {
          is_ready: isCompleted,
        },
      },
    };
    return this.patch(`${ApiConfig.userSchedules}/${scheduleId}`, body);
  }

  /**
   * Blocks schedule
   * @param status
   */
  blockSchedule(status: boolean) {
    const body = {
      data: {
        type: 'schedule',
        attributes: {
          is_blocked: status,
        },
      },
    };
    return this.patch(`${ApiConfig.schedules}/current`, body);
  }

  /**
   * Delete schedule item
   * @param id
   * @returns {Observable<any>}
   */
  deleteScheduleItem(id: string): Observable<void> {
    return this.delete(`${ApiConfig.userScheduleItems}/${id}`);
  }

  /**
   * Searches for user schedule
   * @param query
   * @param id
   * @returns {Observable<any>}
   */
  searchForUserSchedules(query: string, id: number) {
    const params = new HttpParams()
      .append('q', query)
      .append('include', 'schedule')
      .append('exclude_id', id + '');
    return this.get(ApiConfig.userScheduleItems, params);
  }

  /**
   * Gets user schedule item
   * @param {number} userScheduleId -
   * @returns {Observable<PlanningFormBlueprint>}
   */
  getUserScheduleItem(userScheduleId: number): Observable<PlanningFormBlueprint> {
    return this.get(
      `${ApiConfig.userScheduleItems}/${userScheduleId}`,
      new HttpParams().append('include', 'user,user_schedule,schedule'),
    ).pipe(
      map(response => {
        const formBlueprint = {
          id: response.data.id,
          user_id: response.data.relationships.user.data.id,
          agent_id: response.data.relationships.user_schedule.data.id,
          ...response.data.attributes,
        } as PlanningFormBlueprint;
        if (response.included) {
          const userSchedule = response.included.find(item => item.type === 'user_schedule');
          formBlueprint.email = response.included.find(item => item.type === 'user')?.attributes.email;
          formBlueprint.is_ready = userSchedule?.attributes.is_ready || null;
          formBlueprint.is_schedule_blocked = response.included.find(item => item.type === 'schedule')?.attributes.is_blocked || null;
          formBlueprint.is_user_schedule_blocked = userSchedule?.attributes.is_blocked || null;
        }

        return formBlueprint;
      }),
    );
  }

  /**
   * Updates user schedule item
   * @param {PlanningFormBlueprint} planningBlueprint
   * @returns {Observable<any>}
   */
  updateUserScheduleItem(planningBlueprint: PlanningFormBlueprint) {
    const id = planningBlueprint.id;
    delete planningBlueprint.id;

    const payload = `{
            "data": {
                "type": "user_schedule_item",
                "attributes": ${JSON.stringify(planningBlueprint)} 
            }
        }`;

    return this.patch(`${ApiConfig.userScheduleItems}/${id}`, JSON.parse(payload));
  }

  /**
   * Adds user schedule item
   * @param {PlanningFormBlueprint} planningBlueprint
   * @returns {Observable<any>}
   */
  addUserScheduleItem(planningBlueprint: PlanningFormBlueprint) {
    const payload = `{
            "data": {
                "type": "user_schedule_item",
                "attributes": ${JSON.stringify(planningBlueprint)} 
            }
        }`;

    return this.post(`${ApiConfig.userScheduleItems}`, JSON.parse(payload));
  }

  /**
   * Adds user schedule item by admin
   * @param {PlanningFormBlueprint} planningBlueprint
   * @returns {Observable<any>}
   */
  addUserScheduleItemByAdmin(planningBlueprint: PlanningFormBlueprint) {
    const agentId = planningBlueprint.agent_id;
    delete planningBlueprint.agent_id;

    const payload = `{
            "data": {
                "type": "user_schedule_item",
                "attributes": ${JSON.stringify(planningBlueprint)} 
            }
        }`;

    return this.post(`${ApiConfig.scheduleAgents}/${agentId}`, JSON.parse(payload));
  }

  /**
   * Gets user institutions
   * @param {string}[userId]
   * @returns {Observable<{id: string, title: string}[]>}
   */
  getUserInstitutions(userId?: string): Observable<{ id: string; title: string }[]> {
    return this.get(`${ApiConfig.userScheduleInstitutions}/${userId ? userId : ''}`).pipe(
      map(response => {
        return response.data.map(institution => {
          return {
            id: institution.id,
            title: institution.attributes.title,
          };
        });
      }),
    );
  }

  /**
   * Gets user email and its institutions
   * @param {string}[userId]
   * @returns {Observable<{id: string, title: string}[]>}
   */
  getUserEmailAndInstitutions(
    userId: string,
    userEmail: string,
  ): Observable<{ email: string; institutions: { id: string; title: string }[] }> {
    return this.getUserInstitutions(userId).pipe(
      map(institutions => {
        return {
          email: userEmail,
          institutions: institutions,
        };
      }),
    );
  }

  /**
   * Gets user institutions for schedule item
   * @param {string} scheduleId
   * @returns {Observable<{id: string, title: string}[]>}
   */
  getUserInstitutionsForScheduleItem(scheduleId: string): Observable<{ email: string; institutions: { id: string; title: string }[] }> {
    return this.get(`${ApiConfig.scheduleAgents}/${scheduleId}`).pipe(
      map(response => response.data),
      switchMap(response => this.getUserEmailAndInstitutions(response.id, response.attributes.email)),
    );
  }

  /**
   * Gets user institutions for schedule item
   * @param {string} scheduleId
   * @returns {Observable<{id: string, title: string}[]>}
   */
  getUserInstitutionsForScheduleItemId(scheduleId: string): Observable<{ email: string; institutions: { id: string; title: string }[] }> {
    return this.get(`${ApiConfig.userSchedules}/${scheduleId}`, new HttpParams().append('include', 'user')).pipe(
      switchMap(response => this.getUserEmailAndInstitutions(response.included[0].id, response.included[0].attributes.email)),
    );
  }

  /** Opens new schedule
   * @returns {Observable<Schedule>}
   */
  openNewSchedule(): Observable<Schedule> {
    return this.post(ApiConfig.schedules).pipe(
      map(res => this.mapResponseToSchedule(res)),
      catchError((err: HttpCustomErrorResponse) => {
        if (err.status === 403) {
          this.notificationService.clearAlerts();
          err.error.errors.forEach(error => this.notificationService.addError(error.title));
        }
        return throwError(err);
      }),
      switchMap(() => this.getRepresentativesSchedules()),
    );
  }

  /**
   * Informs that table should be reloaded
   * @returns {Observable<void>}
   */
  isTableShouldBeReloaded(): Observable<void> {
    return this.reloadTable$.asObservable();
  }

  /**
   * Emits reload table event
   */
  setTableShouldBeReloaded(): void {
    this.reloadTable$.next();
  }

  /**
   * Gets schedule item comments
   * @param {string} scheduleItemId
   * @returns {Obvervable}
   */
  getScheduleItemComments(scheduleItemId: string): Observable<ScheduleItemComment[]> {
    const url = TemplateHelper.parseUrl(ApiConfig.userScheduleItemComments, { id: scheduleItemId });
    return this.get(url).pipe(map(response => response['data']));
  }

  /**
   * Saves comment
   * @param {string} scheduleItemId
   * @param {string} text
   * @param {string} [commentId]
   * @returns
   */
  saveComment(scheduleItemId: string, text: string, commentId?: string): Observable<ScheduleItemComment> {
    if (commentId) {
      const url = TemplateHelper.parseUrl(ApiConfig.userScheduleItemCommentUpdate, { id: commentId });
      return this.patch(url, text).pipe(map(response => response['data']));
    }

    const url = TemplateHelper.parseUrl(ApiConfig.userScheduleItemComments, { id: scheduleItemId });
    return this.post(url, text).pipe(map(response => response['data']));
  }

  /**
   * Gets schedule for empty user schedule
   * @param id
   * @returns {(err) => (Observable<Schedule>)}
   */
  private getScheduleForEmptyCurrentUserSchedule(id: number | string): (err) => Observable<Schedule> {
    return err => {
      if (err.status === 404) {
        if (id === 'current') {
          return this.getRepresentativesSchedules();
        }
        return of(null);
      }
      return throwError(err);
    };
  }

  /**
   * Catches 404 error
   * @returns {OperatorFunction<any, any>}
   */
  private catch404(): OperatorFunction<any, any> {
    return catchError((err: HttpCustomErrorResponse) => {
      if (err.status === 404) {
        return of(null);
      }
      return throwError(err);
    });
  }

  /**
   * Maps response to Schedule
   * @param response
   * @returns {{newPlanningEndDate: any, data: any, id: number, currentPeriod: any, planningEndDate: any}}
   */
  private mapResponseToSchedule(response: any): Schedule {
    const { data: rawSchedule, included } = response;
    return {
      id: Number(rawSchedule.id),
      planningEndDate: rawSchedule.attributes.end_date,
      newPlanningEndDate: rawSchedule.attributes.new_end_date,
      startDate: rawSchedule.attributes.period_name,
      link: rawSchedule.attributes.link,
      state: rawSchedule.attributes.state,
      periodName: rawSchedule.attributes.period_name,
      totalAgentsCount: rawSchedule.attributes.total_agents_count,
      isBlocked: rawSchedule.attributes.is_blocked,
      data: !included
        ? []
        : included
            .map(data => {
              return {
                id: Number(data.id),
                representative: data.attributes.email,
                institution: data.attributes.planned_user_schedule.institution,
                isReady: data.attributes.planned_user_schedule.is_ready ? 'Tak' : 'Nie',
                datasetsCount: data.attributes.planned_user_schedule.items_count,
                recommendations: data.attributes.planned_user_schedule.recommended_items_count,
              };
            })
            .sort((a, b) => a.institution.localeCompare(b.institution)),
    };
  }

  /**
   * Maps response to User Schedule
   * @param response
   * @returns {UserSchedule}
   */
  private mapResponseToUserSchedule(response: any): UserSchedule {
    const { data, included } = response;
    let userSchedule = data;
    let rawSchedule;
    const rawUserSchedulesItems: Array<any> = [];
    for (let i = 0; i < included.length; i++) {
      const item = included[i];
      if (item.type === 'schedule') {
        rawSchedule = item;
      } else if (item.type === 'user_schedule_item') {
        rawUserSchedulesItems.push(item);
      } else if (item.type === 'user_schedule') {
        userSchedule = item;
      }
    }
    const schedule: UserSchedule = {
      id: Number(rawSchedule.id),
      planningEndDate: rawSchedule.attributes.end_date,
      newPlanningEndDate: rawSchedule.attributes.new_end_date,
      isReady: userSchedule.attributes.is_ready,
      startDate: rawSchedule.attributes.period_name,
      link: rawSchedule.attributes.link,
      state: rawSchedule.attributes.state,
      periodName: rawSchedule.attributes.period_name,
      totalAgentsCount: rawSchedule.attributes.total_agents_count,
      data: !rawUserSchedulesItems
        ? []
        : rawUserSchedulesItems
            .map(item => {
              return {
                id: Number(item.id),
                institution: item.attributes.institution,
                department: item.attributes.institution_unit,
                datasets: item.attributes.dataset_title,
                creationDate: item.attributes.created,
                recommendations: item.attributes.is_recommendation_issued ? 'Tak' : 'Nie',
              };
            })
            .sort((a, b) => a.institution.localeCompare(b.institution)),
    };
    schedule.completed = userSchedule.attributes.is_ready;
    schedule.representativeEmail = userSchedule.attributes.email;
    schedule.userScheduleId = userSchedule.id;
    schedule.isBlocked = rawSchedule.attributes.is_blocked || userSchedule.attributes.is_blocked;
    return schedule;
  }
}

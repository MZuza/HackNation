import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, OperatorFunction, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiConfig } from '@app/services/api';
import { HttpCustomErrorResponse } from '@app/services/models';
import { RestService } from '@app/services/rest.service';
import { ScheduleExportSource } from '@app/user/schedule/table/domain/schedule-table.config';
import { PlanningFormBlueprint, Schedule, ScheduleSettings, UserSchedule } from '@app/user/schedule/tabs/planning/domain/schedule';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService extends RestService {

    static getScheduleWithNewSettings(schedule: Schedule, settings: ScheduleSettings): Schedule {
        return Object.assign(schedule, {
            periodName: settings.period_name,
            planningEndDate: settings.end_date,
            newPlanningEndDate: settings.new_end_date,
            link: settings.link,
        });
    }

    /**
     * Gets schedules item for current schedule
     * @param scheduleId
     * @param isForAdmin
     * @param userScheduleId
     * @returns {Observable<any>}
     */
    getSchedulesItemForCurrentSchedule(scheduleId: number, isForAdmin: boolean, userScheduleId: number): Observable<UserSchedule> {
        if (isForAdmin) {
            const params = new HttpParams()
                .append('include', 'schedule,user_schedule_item');
            return this.get(`${ApiConfig.userSchedules}/${userScheduleId}`, params, true)
                .pipe(
                    map(res => this.mapUserScheduleResponseToUserSchedule(res)),
                    this.catch404()
                );
        } else {
            const params = new HttpParams()
                .append('include', 'schedule,user_schedule');
            return this.get(`${ApiConfig.schedules}/${scheduleId}/user_schedule_items`, params, true)
                .pipe(
                    map(res => this.mapUserScheduleItemsResponseToUserSchedule(res)),
                    switchMap(data => {
                        if (!!!data) {
                            return this.get(ApiConfig.schedules + `/${scheduleId}`)
                                .pipe(map(res => this.mapResponseToSchedule(res)));
                        }
                        return of(data);
                    }),
                    this.catch404()
                );
        }
    }

    /**
     * Gets representatives schedule
     * @param id
     * @param state
     * @returns {Observable<any>}
     */
    getRepresentativesSchedules(id: string, state: 'implemented' | 'archived'): Observable<Schedule> {
        const params = new HttpParams()
            .append('state', state)
            .append('include', 'user_schedule');
        return this.get(ApiConfig.schedules + (id ? `/${id}` : ''), params, true)
            .pipe(
                map(res => this.mapResponseToSchedule(res)),
                this.catch404()
            );
    }

    /**
     * Gets schedules
     * @param state
     * @returns {Observable<{data: any}>}
     */
    getSchedules(state: 'implemented' | 'archived'): Observable<any> {
        const params = new HttpParams()
            .append('state', state)
            .append('sort', '-id');
        return this.get(ApiConfig.schedules, params)
            .pipe(map(res => {
                return {
                    data: res.data.map(item => {
                        return {
                            id: item.id,
                            link: item.attributes.link,
                            period: item.attributes.period_name
                        };
                    })
                };
            }));

    }

    /**
     * Move schedule to archive
     * @param scheduleId
     * @returns {Observable<any>}
     */
    moveScheduleToArchive(scheduleId: number): Observable<void> {
        const body = {
            data: {
                type: 'schedule',
                attributes: {
                    state: 'archived'
                }
            }
        };
        return this.patch(`${ApiConfig.schedules}/${scheduleId}`, body);
    }


    /**
     * Restore schedule to implemented state
     * @param scheduleId
     * @returns {Observable<any>}
     */
    restoreScheduleToImplemented(scheduleId: number): Observable<void> {
        const body = {
            data: {
                type: 'schedule',
                attributes: {
                    state: 'implemented'
                }
            }
        };
        return this.patch(`${ApiConfig.schedules}/${scheduleId}`, body);
    }

    /**
     * Adds user schedule item by admin
     * @param {PlanningFormBlueprint} planningBlueprint
     * @returns {Observable<any>}
     */
    addUserScheduleItemByAdmin(planningBlueprint: PlanningFormBlueprint) {
        const user_schedule_id = planningBlueprint.user_schedule_id;
        delete planningBlueprint.user_schedule_id;

        const payload = `{
            "data": {
                "type": "user_schedule_item",
                "attributes": ${JSON.stringify(planningBlueprint)} 
            }
        }`;

        return this.post(`${ApiConfig.userSchedules}/${user_schedule_id}`, JSON.parse(payload));
    }

    getExportUrl(source: ScheduleExportSource, id: number | 'current' = 'current', format: 'csv' | 'xlsx',
                 isFullExport: boolean = false) {
        const url = source === 'schedules' ?
            `${ApiConfig.schedules}/${id}.${format}` : `${ApiConfig.userSchedules}/${id}/items.${format}`;

        const queryParams = isFullExport ? new HttpParams()
            .append('full', isFullExport + '') : undefined;

        return this.get(url, queryParams)
            .pipe(map(response => response.data?.attributes?.url));
    }

    /**
     * Maps response from user schedule endpoint to user schedule
     * @param response
     * @returns {UserSchedule}
     */
    private mapUserScheduleResponseToUserSchedule(response: any): UserSchedule {
        const {data: userSchedule, included} = response;
        let rawSchedule;
        const rawUserSchedulesItems: Array<any> = [];
        for (let i = 0; i < included.length; i++) {
            const item = included[i];
            if (item.type === 'schedule') {
                rawSchedule = item;
            } else {
                rawUserSchedulesItems.push(item);
            }
        }
        return this.mapToUserSchedule(rawSchedule, rawUserSchedulesItems, userSchedule);
    }

    /**
     * Maps response from user schedule items endpoint to user schedule
     * @param response
     * @returns {UserSchedule}
     */
    private mapUserScheduleItemsResponseToUserSchedule(response: any): UserSchedule {
        const {data: rawUserSchedulesItems, included} = response;

        if (!included) {
            throwError(new Error('There is no User Schedule'));
            return;
        }

        let rawSchedule;
        let userSchedule;
        if (!included) {
            throwError(new Error('There is no User Schedule'));
            return;
        }
        for (let i = 0; i < included.length; i++) {
            const item = included[i];
            if (item.type === 'schedule') {
                rawSchedule = item;
            }
            if (item.type === 'user_schedule') {
                userSchedule = item;
            }
        }
        return this.mapToUserSchedule(rawSchedule, rawUserSchedulesItems, userSchedule);
    }

    /**
     * Maps to user schedule
     * @param rawSchedule
     * @param rawUserSchedulesItems
     * @param userSchedule
     * @returns {UserSchedule}
     */
    private mapToUserSchedule(rawSchedule: any, rawUserSchedulesItems: any, userSchedule: any): UserSchedule {
        const schedule: UserSchedule = {
            id: Number(rawSchedule.id),
            planningEndDate: rawSchedule.attributes.end_date,
            newPlanningEndDate: rawSchedule.attributes.new_end_date,
            startDate: rawSchedule.attributes.period_name,
            periodName: rawSchedule.attributes.period_name,
            link: rawSchedule.attributes.link,
            state: rawSchedule.attributes.state,
            data: !rawUserSchedulesItems ? [] : rawUserSchedulesItems.map(item => {
                return {
                    id: Number(item.id),
                    institution: item.attributes.institution,
                    department: item.attributes.institution_unit,
                    datasets: item.attributes.dataset_title,
                    creationDate: item.attributes.created,
                    recommendations: item.attributes.is_recommendation,
                    accepted: item.attributes.is_accepted ? 'Tak' : 'Nie',
                    finished: item.attributes.is_resource_added ? 'Tak' : 'Nie'
                };
            }).sort((a, b) => a.institution.localeCompare(b.institution))
        };
        schedule.userScheduleId = userSchedule.id;
        schedule.completed = userSchedule.attributes.is_ready;
        schedule.representativeEmail = userSchedule.attributes.email;
        return schedule;
    }

    /**
     * Maps response to Schedule
     * @param response
     * @returns {{newPlanningEndDate: any, data: any, id: number, currentPeriod: any, planningEndDate: any}}
     */
    private mapResponseToSchedule(response: any): Schedule {
        const {data: rawSchedule, included} = response;
        return {
            id: Number(rawSchedule.id),
            planningEndDate: rawSchedule.attributes.end_date,
            newPlanningEndDate: rawSchedule.attributes.new_end_date,
            startDate: rawSchedule.attributes.period_name,
            link: rawSchedule.attributes.link,
            state: rawSchedule.attributes.state,
            periodName: rawSchedule.attributes.period_name,
            data: !!!included ? [] : included.map(data => {
                return {
                    id: Number(data.id),
                    representative: data.attributes.email,
                    institution: data.attributes.institution,
                    isReady: data.attributes.is_ready ? 'Tak' : 'Nie',
                    datasetsCount: data.attributes.items_count,
                    recommendations: data.attributes.recommended_items_count,
                    implementedItems: data.attributes.implemented_items_count
                };
            }).sort((a, b) => a.institution.localeCompare(b.institution))
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
}

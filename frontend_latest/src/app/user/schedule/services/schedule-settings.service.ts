import { Injectable } from '@angular/core';

import { RestService } from '@app/services/rest.service';
import { ApiConfig } from '@app/services/api';
import { ScheduleSettings } from '../tabs/planning/domain/schedule';

/**
 * Schedule Notifications Service
 */
@Injectable({
  providedIn: 'root',
})
export class ScheduleSettingsService extends RestService {
  /**
   * Updates schedule settings
   * @param {ScheduleSettings} settings
   * @param isOnlyLinkEditable
   * @returns {Observable<any>}
   */
  updateScheduleSettings(settings: ScheduleSettings, isOnlyLinkEditable: boolean) {
    const schedule_id = settings.schedule_id;
    delete settings.schedule_id;

    const payload = `{
            "data": {
                "type": "schedule",
                "attributes": ${isOnlyLinkEditable ? JSON.stringify({ link: settings.link }) : JSON.stringify(settings)}
            }
        }`;

    return this.patch(`${ApiConfig.schedules}/${schedule_id}`, JSON.parse(payload));
  }
}

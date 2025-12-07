import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestService } from '@app/services/rest.service';
import { ApiConfig } from '@app/services/api';
import { TemplateHelper } from '@app/shared/helpers';
import { ScheduleNotificationRecipientType } from '@app/user/schedule/services/schedule-notification-recipient-type';
import { ScheduleNotificationMessage } from '@app/user/schedule/services/schedule-notification-message';

/**
 * Schedule Notifications Service
 */
@Injectable({
  providedIn: 'root',
})
export class ScheduleNotificationsService extends RestService {
  sendNotification(notification: ScheduleNotificationMessage) {
    const payload = `{
            "data": {
                "type": "notification",
                "attributes": {
                    "notification_type": ${JSON.stringify(notification.type)},
                    "message": ${JSON.stringify(notification.message)}
                }
            }
        }`;

    return this.post(ApiConfig.userScheduleNotifications, JSON.parse(payload));
  }

  /**
   * Removes notification by id
   * @param {string} id
   * @returns {Observable}
   */
  removeById(id: number): Observable<any> {
    const payload = `{
            "data": {
                "type": "notification",
                "attributes": {
                    "unread": false
                }
            }
        }`;

    return this.patch(TemplateHelper.parseUrl(ApiConfig.userScheduleNotification, { id: id }), JSON.parse(payload));
  }

  /**
   * Recipient option list
   * @returns {ScheduleNotificationRecipient[]}
   */
  getRecipientTypes(): ScheduleNotificationRecipientType[] {
    return [
      { name: 'wszystkich', value: 'all' },
      { name: 'spóźnionych', value: 'late' },
    ];
  }
}

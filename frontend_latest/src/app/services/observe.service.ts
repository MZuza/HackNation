import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiConfig } from '@app/services/api';
import { BasicPageParams } from '@app/services/models/page-params';
import { RestService } from '@app/services/rest.service';
import { TemplateHelper } from '@app/shared/helpers';

/**
 * General following changes service that handles API communication
 */
@Injectable()
export class ObserveService extends RestService {
  notificationsChanged: Subject<void> = new Subject<void>();

  /**
   * Follow changes of a given resource with specific id
   * Only for logged in users (requires api_key)
   * @param {string} objectType
   * @param {string} objectId
   * @param {string} name
   * @param {number} count
   * @returns {Observable<any>}
   */
  addSubscription(objectType: string, objectId: string, name?: string, count?: number): Observable<any> {
    let objects_count: string;
    if (name) {
      name = `"name": ${JSON.stringify(name)},`;
    } else {
      name = '';
    }

    if (count) {
      objects_count = `"objects_count": ${JSON.stringify(count)},`;
    } else {
      objects_count = '';
    }

    const payload = `{
            "data": {
                "type": "subscription",
                "attributes": {
                    ${name}
                    ${objects_count}
                    "object_name": ${JSON.stringify(objectType)},
                    "object_ident": ${JSON.stringify(objectId)}
                }
            }
        }`;

    return this.post(ApiConfig.subscribe, JSON.parse(payload));
  }

  /**
   * Stop following changes of a given resource with specific id
   * Only for logged in users (requires api_key)
   * @param {number} id
   * @returns {Observable<any>}
   */
  removeSubscription(id: number): Observable<any> {
    const url = TemplateHelper.parseUrl(ApiConfig.unsubscribe, { subscriptionId: id });
    return this.delete(url);
  }

  /**
   * @param {string} objectType
   * @param {BasicPageParams} params
   * @returns {Observable<any>}
   */
  getSubscriptions(objectType: string, params: BasicPageParams): Observable<any> {
    params['object_name'] = objectType;
    return this.get(ApiConfig.subscribe, new HttpParams({ fromObject: params }));
  }

  /**
   * Gets new notifications
   * @returns {Observable<any>}
   */
  getNewNotifications(): Observable<any> {
    return this.get(ApiConfig.activityNotifications, new HttpParams().append('status', 'new'));
  }

  /**
   * Mark all notifications as read.
   */
  markAllAsRead() {
    return this.delete(ApiConfig.markAllNotificationsAsRead);
  }
}

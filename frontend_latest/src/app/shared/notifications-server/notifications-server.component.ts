import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';

import { NotificationsService } from '@app/services/notifications.service';

/**
 * Notifications components displays global notifications from Notification Service
 * @example
 * <app-notifications></app-notifications>
 */

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications-server.component.html',
    standalone: true,
    imports: [NotificationsComponent],
})
export class NotificationsServerComponent implements OnInit, OnDestroy {
  /**
   * Local alerts variable
   */
  alerts: any[];
  /**
   * Notification Service subscription
   */
  notificationsSubscription: Subscription;

  /**
   * @ignore
   */
  constructor(private notificationsService: NotificationsService) {}

  /**
   * Subscribe to notification service
   */
  ngOnInit() {
    this.notificationsSubscription = this.notificationsService.getAlerts().subscribe(alerts => (this.alerts = alerts));
  }

  /**
   * Clear alerts and unsubscribe from service (lack of .complete method means hanging Observable subscription.
   */
  ngOnDestroy() {
    this.notificationsService.clearAlerts();
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }
}

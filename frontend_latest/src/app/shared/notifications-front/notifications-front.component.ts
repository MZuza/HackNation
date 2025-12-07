import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';

import { NotificationsFrontService } from '@app/services/notifications-front.service';

/**
 * Notifications components displays global notifications from Notification Front Service
 * @example
 * <app-notifications-front></app-notifications-front>
 */

@Component({
    selector: 'app-notifications-front',
    templateUrl: './notifications-front.component.html',
    standalone: true,
    imports: [NotificationsComponent],
})
export class NotificationsFrontComponent implements OnInit, OnDestroy {
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
  constructor(private notificationsService: NotificationsFrontService) {}

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

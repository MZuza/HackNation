import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Notifications components displays global notifications from Notification Service
 * @example
 * <app-notifications></app-notifications>
 */
@Component({
    selector: '[app-notifications]',
    templateUrl: './notifications.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        SanitizeHtmlPipe,
    ],
})
export class NotificationsComponent {
  @Input() alerts: any[];

  /**
   * @ignore
   */
  constructor() {}
}

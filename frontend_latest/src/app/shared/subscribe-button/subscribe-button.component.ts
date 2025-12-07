import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipDirective } from '../tooltip/tooltip.directive';

import { ApiModel } from '@app/services/api/api-model';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { ObserveService } from '@app/services/observe.service';
import { UserService } from '@app/services/user.service';

/**
 * Subscribe Button Component.
 * Toggles subscriptions for provided objects of specified types.
 * @example
 * <app-subscribe-button [item]="item"></app-subscribe-button>
 */
@Component({
    selector: 'app-subscribe-button',
    templateUrl: './subscribe-button.component.html',
    standalone: true,
    imports: [
        TooltipDirective,
        NgIf,
        NgClass,
        TranslatePipe,
    ],
})
export class SubscribeButtonComponent implements OnInit {
  /**
   * Observed object type
   */
  @Input() type: ApiModel = ApiModel.DATASET;

  /**
   * Object (application, article, dataset) to be observed
   */
  @Input() item: any;

  /**
   * bootstrap class for styling
   */
  @Input() bootstrapClass = 'btn-primary';

  /**
   * Tooltip title
   * @type {string}
   */
  @Input() tooltipTitle: string;

  /**
   * Tooltip text
   * @type {string}
   */
  @Input() tooltipText: string;

  /**
   * Subscription id of the subscribed object
   * @type {number}
   */
  subscriptionId: number;

  /**
   * @ignore
   */
  constructor(
    public userService: UserService,
    private observeService: ObserveService,
    private notificationsService: NotificationsFrontService,
  ) {}

  /**
   * Checks weather object is already subscribed and stores is subscription data
   */
  ngOnInit() {
    if (this.item.relationships && this.item.relationships.subscription) {
      const relatedUrl = this.item.relationships.subscription.links.related;
      const lastSlashIndex = relatedUrl.lastIndexOf('/');
      this.subscriptionId = relatedUrl.slice(lastSlashIndex + 1, relatedUrl.length);
    }
  }

  /**
   * Sets subscription on related object (item)
   */
  addSubscription() {
    this.observeService.addSubscription(this.type, this.item.id).subscribe(
      subscribedObject => {
        this.subscriptionId = subscribedObject.data.id;
      },
      () => {
        this.notificationsService.addAlertWithTranslation('info', 'User.LogInToFollow');
      },
    );
  }

  /**
   * Removes subscription from related object (item)
   */
  removeSubscription() {
    this.observeService.removeSubscription(this.subscriptionId).subscribe(() => {
      this.subscriptionId = null;
    });
  }
}

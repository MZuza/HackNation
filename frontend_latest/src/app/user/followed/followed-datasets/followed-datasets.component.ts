import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { ApiModel } from '@app/services/api/api-model';
import { BasicPageParams } from '@app/services/models/page-params';
import { ObserveService } from '@app/services/observe.service';
import { SeoService } from '@app/services/seo.service';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';

/**
 * Followed Datasets Component
 */
@Component({
    selector: 'app-followed-datasets',
    templateUrl: './followed-datasets.component.html',
    standalone: true,
    imports: [
        NotificationsServerComponent,
        NgIf,
        ResultListComponent,
        RouterLink,
        ItemsPerPageComponent,
        PaginationComponent,
        AsyncPipe,
        LocalizeRouterPipe,
        TranslatePipe,
        SanitizeHtmlPipe,
        TranslateDateFormatPipe,
    ],
})
export class FollowedDatasetsComponent implements OnInit {
  /**
   * Default page params
   */
  params: BasicPageParams = {
    page: 1,
    per_page: 5,
    sort: '-modified',
  };

  /**
   * Array of items (followed objects)
   */
  items: any[];

  /**
   * Followed datasets
   */
  followedDatasets: any[];

  /**
   * Subscription type (i.e. 'dataset')
   */
  subscriptionType = ApiModel.DATASET;

  /**
   * Count of items (followed objects)
   */
  count: number;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private observeService: ObserveService) {}

  /**
   * Initializes lists
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Datasets.Self', 'MyDashboard.FollowedObjects', 'MyDashboard.Self']);
    this.getSubscriptions();
  }

  /**
   * Remove subscription of a dataset by its index
   * @param {number} index
   */
  removeSubscription(index: number) {
    this.observeService.removeSubscription(this.followedDatasets[index]).subscribe(() => this.getSubscriptions());
  }

  /**
   * Updates query params on every user interaction
   * @param {any} params
   */
  updateParams(params: any) {
    this.params = Object.assign(this.params, params);
    this.getSubscriptions();
  }

  /**
   * Tracks list of items by single item id to prevent re-rendering of existing elements in the template
   * @param {any} index
   * @param {index} item
   * @returns {string}
   */
  trackById(index: number, item: any) {
    return item.id;
  }

  /**
   * Initializes lists of subscriptions and related datasets
   */
  private getSubscriptions() {
    this.observeService.getSubscriptions(this.subscriptionType, this.params).subscribe(subscriptions => {
      if (!subscriptions || !subscriptions['included'] || !subscriptions['data']) {
        if (this.items?.length > 0) {
          this.items = [];
          this.count = subscriptions['meta']['count'];
          this.followedDatasets = [];
        }
        return;
      }

      this.items = subscriptions['included'];
      this.count = subscriptions['meta']['count'];
      this.followedDatasets = subscriptions['data'] ? subscriptions['data'].map(subscription => subscription.id) : subscriptions['data'];
    });
  }
}

import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FollowQueryResultsComponent } from '../follow-query-results/follow-query-results.component';

import { BasicPageParams } from '@app/services/models/page-params';
import { ObserveService } from '@app/services/observe.service';
import { SeoService } from '@app/services/seo.service';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';

/**
 * Followed Query Component
 */
@Component({
    selector: 'app-followed-query',
    templateUrl: './followed-query.component.html',
    standalone: true,
    imports: [NotificationsServerComponent, NgIf, FollowQueryResultsComponent, ItemsPerPageComponent, PaginationComponent, TranslatePipe]
})
export class FollowedQueryComponent implements OnInit {
    /**
     * Default params of followed queries
     */
    params: BasicPageParams = {
        per_page: 5,
        page: 1,
        sort: '-modified'
    };

    /**
     * Array of items (followed objects)
     */
    items: any[];

    subscriptions: any[];

    /**
     * Subscription type ('query' by default)
     */
    subscriptionType = 'query';

    /**
     * Count of items (followed objects)
     */
    count: number;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private observeService: ObserveService,
                private activatedRoute: ActivatedRoute) {
    }

    /**
     * Initializes list of items (applications) on component init
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['Search.Results', 'MyDashboard.FollowedObjects', 'MyDashboard.Self']);
        this.getSubscriptions();
    }

    /**
     * Stop following changes of specified object
     * Only logged in users
     * @param {number} id
     * @returns {Observable<any>}
     */
    removeSubscription(index: number) {
        this.observeService
            .removeSubscription(this.subscriptions[index])
            .subscribe(() => this.getSubscriptions());
    }

    /**
     * Updates query params and items on every user interaction
     * @param {any} params
     */
    updateParams(params: any) {
        this.params = Object.assign(this.params, params);
        this.getSubscriptions();
    }

    /**
     * Initializes list of items
     */
    private getSubscriptions() {
        this.observeService
            .getSubscriptions(this.subscriptionType, this.params)
            .subscribe(subscriptions => {

                const subscriptionsData = subscriptions['data'].map(item => {
                    if (item.relationships && item.relationships.subscribed_object) {
                        const queryParamsObj = this.getQueryParamsObjectFromUrl(item.relationships.subscribed_object.data.id);
                        item['query_params'] = this.adjustQueryParams(queryParamsObj);
                    }
                    return item;
                });

                this.items = subscriptionsData;
                this.subscriptions = subscriptionsData.map(subscription => subscription.id);
                this.count = subscriptions['meta']['count'];
            });
    }

    /**
     * Gets query params object from url
     * @param {string} url
     * @returns query params object
     */
    private getQueryParamsObjectFromUrl(url: string): Object {
        let key, value;
        return url
            .split('?')[1]
            .split('&')
            .map(paramString => paramString.split('='))
            .reduce((obj, pair) => {
                [key, value] = pair.map(decodeURIComponent);
                if (obj[key]) {
                    value = obj[key] + ',' + value;
                }
                return ({ ...obj, [key]: value });
            }, {});
    }

    /**
     * Adjusts query params
     * @param {Object} queryParamsObj
     * @returns {Object}
     */
    private adjustQueryParams(queryParamsObj: Object) {
        const queryParamsObjClone = { ...queryParamsObj };
        const queryParamsString = JSON.stringify(queryParamsObjClone);

        return JSON.parse(queryParamsString.replace(/\|/g, ',').replace(/\_\_in/g, ''));
    }
}

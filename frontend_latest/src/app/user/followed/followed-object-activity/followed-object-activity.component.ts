import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { ApiModel } from '@app/services/api/api-model';
import { BasicPageParams } from '@app/services/models/page-params';
import { ObserveService } from '@app/services/observe.service';
import { UserService } from '@app/services/user.service';
import { LinkHelper } from '@app/shared/helpers';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { TimespanPipe } from '@app/shared/pipes/timespan.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';

@Component({
    selector: 'app-followed-object-activity',
    templateUrl: './followed-object-activity.component.html',
    standalone: true,
    imports: [
      NgFor,
      NgIf,
      RouterLink,
      ItemsPerPageComponent,
      PaginationComponent,
      LocalizeRouterPipe,
      TranslatePipe,
      TimespanPipe,
      TranslateDateFormatPipe
    ]
})
export class FollowedObjectActivityComponent implements OnInit {

    /**
     * API model
     */
    apiModel = ApiModel;

    /**
     * Language
     */
    @Input() lang: string;

    /**
     * Array of all activities from api response
     */
    public activities = [];

    /**
     * Array of new activities from api response
     */
    private newActivities = [];

    /**
     * Subscribed objects
     */
    public subscriptions = [];

    /**
     * Default params of followed objects activity component
     */
    params: BasicPageParams = {
        per_page: 5,
        page: 1,
        sort: '-modified'
    };

    /**
     * Count of items (followed objects)
     */
    count: number;

    /**
     * Regular expression to test notification type for html template
     */
    regexp = /^related/;

    /**
     * @ignore
     */
    constructor(private route: ActivatedRoute,
                private userService: UserService,
                private observeService: ObserveService) {
    }

    /**
     * Calls methods for loading object type and corresponding activities
     */
    ngOnInit() {
        this.loadActivities();
    }

    /**
     * Loads activities from api and increment page number
     */
    private loadActivities(): void {
        this.userService
            .getFollowedObjectsActivity(this.route.snapshot.data['type'], this.params)
            .subscribe(result => {
                this.activities = result.data;
                this.newActivities = result.data.filter(item => item.attributes.status === 'new');
                this.count = result['meta']['count'];
                this.subscriptions = result.data.map(item => {
                    if (item.relationships && item.relationships.subscribed_object) {
                        const subscribed = item.relationships.subscribed_object;
                        const relatedObject = result.included.find(element => {
                            return element.links.self === subscribed.links.related;
                        });

                        if (relatedObject) {
                            subscribed['title'] = relatedObject.attributes.title;
                            subscribed['queryParams'] = LinkHelper.parseQueryString(relatedObject.links.self.split('?')[1]);
                        }

                        return subscribed;
                    }
                });

                this.changeStatusForNewActivities();
            });
    }

    /**
     * Changes status for new activities
     */
    private changeStatusForNewActivities(): void {
        if (!this.newActivities || (this.newActivities && !this.newActivities.length)) {
            return;
        }

        const body = this.buildBodyObject();
        this.userService
            .setNotificationsStatusAsRead(body)
            .subscribe(() => this.observeService.notificationsChanged.next());
    }

    /**
     * Build payload body for PATCH request
     * @returns {object}
     */
    private buildBodyObject(): object {
        const data = this.newActivities.map(item => {
            return {
                'type': item.type,
                'id': item.id,
                'attributes': { 'status': 'read' }
            };
        });

        return { 'data': data };
    }

    /**
     * Updates query params and items (notifications) on every user interaction
     * @param {any} params
     */
    updateParams(params: any) {
        this.params = Object.assign(this.params, params);
        this.loadActivities();
    }
}

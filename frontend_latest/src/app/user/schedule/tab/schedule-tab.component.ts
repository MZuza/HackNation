import { Location, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Schedule Tab Component
 */
@Component({
    selector: 'app-schedule-tab',
    templateUrl: './schedule-tab.component.html',
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        RouterOutlet,
    ],
})
export class ScheduleTabComponent implements OnDestroy {

    /**
     * Determines if current route has child
     */
    hasChildRoute: boolean;

    /**
     * Back url
     * @type {Array<string>}
     */
    backURL: Array<string>;

    /**
     * Router event subscription
     * @type {Subscription}
     */
    private routerEvents$: Subscription;

    /**
     * Subscribe for navigation end
     * @param activeRoute
     * @param router
     * @param location
     */
    constructor(private readonly activeRoute: ActivatedRoute,
                private readonly router: Router,
                private readonly location: Location) {
        this.routerEvents$ = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hasChildRoute = this.activeRoute.snapshot.children && this.activeRoute.snapshot.children.length > 0;
                this.setupBackURL();
            });

    }

    /**
     * Clean subscriptions
     */
    ngOnDestroy() {
        this.routerEvents$.unsubscribe();
    }

    /**
     * Setups back url
     */
    private setupBackURL() {
        const urlSegments = this.location.path().split('/');
        const isOneBeforeLastIsID = Number(urlSegments[urlSegments.length - 2]);
        const lastBackURLSegmentIndex = this.getLastBackURLSegmentIndex(isOneBeforeLastIsID, urlSegments);
        this.backURL = ['/', ...urlSegments.slice(1, (urlSegments.length - lastBackURLSegmentIndex))];
    }

    /**
     * Gets index of last back url segment
     * @param isOneBeforeLastIsID
     * @param urlSegments
     * @returns {number}
     */
    private getLastBackURLSegmentIndex(isOneBeforeLastIsID: number, urlSegments: string[]) {
        return !isOneBeforeLastIsID && urlSegments[urlSegments.length - 2] !== 'in-progress' &&
        urlSegments[urlSegments.length - 2] !== 'archive' ? 2 : 1;
    }
}

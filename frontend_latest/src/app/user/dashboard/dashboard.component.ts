import { DOCUMENT, LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { APP_CONFIG } from '@app/app.config';
import { FixedSidebarDirective } from '@app/shared/directives/fixed-sidebar.directive';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';

/**
 * Dashboard Component
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [
        NgClass,
        FixedSidebarDirective,
        RouterLinkActive,
        RouterLink,
        PermissionDirective,
        NgIf,
        RouterOutlet,
        LowerCasePipe,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class DashboardComponent implements OnInit {
    /**
     * Is sidebar visible
     */
    sidebarVisible = true;

    /**
     * Discourse forum url
     */
    forumUrl: string;

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;

    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    /**
     * Initializes forum url
     */
    ngOnInit() {
        const {protocol, hostname} = this.document.location;
        this.forumUrl = !environment.production ? APP_CONFIG.urls.forumInt : protocol + '//forum.' + hostname.replace('www.', '');
    }
}

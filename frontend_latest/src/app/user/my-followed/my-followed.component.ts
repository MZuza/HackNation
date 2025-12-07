import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FollowedEmailNotificationConsentComponent } from '../followed/followed-email-notification-consent/followed-email-notification-consent.component';

import { toggleVertically } from '@app/animations';
import { User } from '@app/services/models';
import { SeoService } from '@app/services/seo.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';

/**
 * My Followed Component
 */
@Component({
    selector: 'app-my-followed',
    templateUrl: './my-followed.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [
      NotificationsServerComponent,
      NgIf,
      FollowedEmailNotificationConsentComponent,
      RouterLinkActive,
      RouterLink,
      RouterOutlet,
      TranslatePipe
    ]
})
export class MyFollowedComponent implements OnInit {

    /**
     * Api param name for toggle notifications payload
     */
    readonly emailNotificationsAttribute = 'subscriptions_report_opt_in';

    /**
     * Logged in user
     */
    user: User;

    /**
     * Does user permit email notifications
     */
    hasNotificationsEnabled = false;

    /**
     * Visibility of consent panel
     */
    isConsentVisible = false;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private userService: UserService,
                private userStateService: UserStateService) {
    }

    /**
     * Sets META tags (title).
     * Initializes logged in user and checks notifications permissions.
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['MyDashboard.FollowedObjects']);
        this.checkUserNotificationsPermissions();
    }

    /**
     * Checks user notifications permissions
     */
    private checkUserNotificationsPermissions() {
        this.userStateService
            .getCurrentUser()
            .subscribe((user: User) => {
                this.user = user;
                this.hasNotificationsEnabled = user.attributes[this.emailNotificationsAttribute];
            });
    }

    /**
     * Toggles notifications and visibility of consent panel on button click
     */
    onTogglePermission() {
        this.hasNotificationsEnabled ? this.setNotifications(false) : this.isConsentVisible = true;
    }

    /**
     * Sets email notifications for user
     * @param {boolean} status
     */
    setNotifications(status: boolean) {
        this.isConsentVisible = false;
        this.userService
            .toggleEmailNotificationConsent({[this.emailNotificationsAttribute]: status})
            .subscribe((user: User) => {
                this.hasNotificationsEnabled = user.attributes[this.emailNotificationsAttribute];
            });
    }
}

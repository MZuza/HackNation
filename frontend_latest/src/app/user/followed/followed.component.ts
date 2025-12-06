import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { User } from '@app/services/models';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';

/**
 * Followed Component
 */
@Component({
    selector: 'app-followed',
    templateUrl: './followed.component.html',
    standalone: true,
    imports: [
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        TranslatePipe,
    ],
})

export class FollowedComponent implements OnInit {

    userId: number;

    permitEmailNotifications: boolean;

    /**
     * @ignore
     */
    constructor(
        private userService: UserService,
        private userStateService: UserStateService
    ) { }

    /**
    * Get userId and set permitEmailNotifications flag
    */
    ngOnInit(): void {
        this.userStateService.getCurrentUser().subscribe(
            (user: User) => {
                this.permitEmailNotifications = user.attributes.subscriptions_report_opt_in;
                this.userId = user.id;
            }
        );
    }
}

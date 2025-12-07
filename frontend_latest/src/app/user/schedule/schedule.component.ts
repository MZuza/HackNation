import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ScheduleNotificationsSwitch } from './schedule-settings/schedule-notifications-switch.component';

import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';

/**
 * Schedule Component
 */
@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    standalone: true,
    imports: [
        PermissionDirective,
        ScheduleNotificationsSwitch,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        TranslatePipe,
    ],
})
export class ScheduleComponent {
  /**
   * @ignore
   */
  PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}

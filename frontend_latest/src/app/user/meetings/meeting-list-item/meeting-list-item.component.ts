import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CollapsibleTextComponent } from '@app/shared/collapsible-text/collapsible-text.component';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { MeetingListItem } from '@app/user/meetings/MeetingListItem';

/**
 * Meeting List Item Component
 */
@Component({
    selector: 'app-meeting-list-item',
    templateUrl: './meeting-list-item.component.html',
    standalone: true,
    imports: [
        NgIf,
        CollapsibleTextComponent,
        PermissionDirective,
        NgFor,
        NgClass,
        TitleCasePipe,
        TranslatePipe,
    ],
})
export class MeetingListItemComponent {

    /**
     * MeetingListItem
     */
    @Input() meeting: MeetingListItem;

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}

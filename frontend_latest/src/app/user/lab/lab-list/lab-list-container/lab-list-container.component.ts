import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LabListItemComponent } from '../lab-list-item/lab-list-item.component';

import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';

/**
 * Lab List Component
 */
@Component({
    selector: 'app-lab-list-container',
    templateUrl: './lab-list-container.component.html',
    standalone: true,
    imports: [NgFor, LabListItemComponent],
})
export class LabListContainerComponent extends UserDashboardListViewBaseComponent {
    /**
     * Type of laboratory items
     */
    @Input()
    items: any;
}

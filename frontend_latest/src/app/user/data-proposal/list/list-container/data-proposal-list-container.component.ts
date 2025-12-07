import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DataProposalListItemComponent } from '../data-proposal-list-item/data-proposal-list-item.component';

import { DataProposalListItem } from '@app/user/data-proposal/list/DataProposalListItem';
import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';

/**
 * Data Proposal List Container Component
 */
@Component({
    selector: 'app-data-proposal-list-container',
    templateUrl: './data-proposal-list-container.component.html',
    standalone: true,
    imports: [NgFor, DataProposalListItemComponent],
})
export class DataProposalListContainerComponent extends UserDashboardListViewBaseComponent {
  /**
   * Type of data proposal items
   */
  @Input()
  items: Array<DataProposalListItem>;
}

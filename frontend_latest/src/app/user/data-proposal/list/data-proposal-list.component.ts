import { Component, Input, OnInit, Type } from '@angular/core';
import { UserDashboardListViewComponent } from '../../list-view/user-dashboard-list-view.component';

import { DataProposalListContainerComponent } from '@app/user/data-proposal/list/list-container/data-proposal-list-container.component';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';

/**
 * Data Proposal List Component
 */
@Component({
    selector: 'app-data-proposal-list',
    templateUrl: './data-proposal-list.component.html',
    standalone: true,
    imports: [UserDashboardListViewComponent],
})
export class DataProposalListComponent implements OnInit {
  /**
   * Type of data proposal items
   */
  @Input()
  type: string;

  config: UserDashboardListViewConfig;
  listContainer: Type<DataProposalListContainerComponent> = DataProposalListContainerComponent;

  ngOnInit(): void {
    this.config = new UserDashboardListViewConfig.builder()
      .default()
      .withFoundedItemsCountHeader(null)
      .withSort('-published_at')
      .withAdditionalPageParams({ is_active: this.type === 'active' })
      .build();
  }
}

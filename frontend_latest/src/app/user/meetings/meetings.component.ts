import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDashboardListViewComponent } from '../list-view/user-dashboard-list-view.component';

import { ApiConfig } from '@app/services/api';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { API_URL } from '@app/user/list-view/API_URL';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';
import { MeetingsListContainerComponent } from '@app/user/meetings/meetings-list/meetings-list-container.component';
import { MeetingType } from '@app/user/meetings/MeetingType';

/**
 * Meetings Component
 */
@Component({
    selector: 'app-meetings',
    templateUrl: './meetings.component.html',
    providers: [{ provide: API_URL, useValue: ApiConfig.meetings }],
    standalone: true,
    imports: [UserDashboardListViewComponent, TranslatePipe],
})
export class MeetingsComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private readonly userService: UserService) {}

  /**
   * List container component
   * @type {MeetingsListContainerComponent}
   */
  meetingsListContainerComponent: any = MeetingsListContainerComponent;

  /**
   * List config
   */
  config: UserDashboardListViewConfig;

  /**
   * Setups list config
   */
  ngOnInit(): void {
    this.seoService.setPageTitle(['Spotkania pełnomocników', 'Mój Pulpit']);
    this.setupListConfig();
  }

  /**
   * Setups list config
   */
  private setupListConfig(): void {
    const currentUserHasPermissionToFilters = this.userService.hasRequiredRole(PermissionPerRoles.FILTER_MEETINGS);
    const filterConfig = {
      filterType: MeetingType,
      selectedFilters: [MeetingType.PLANNED.toString(), MeetingType.FINISHED.toString()],
      title: 'ProxiesMeetings.StatusMeetings',
    };
    this.config = new UserDashboardListViewConfig.builder()
      .default()
      .withFoundedItemsCountHeader(null)
      .withSort('-start_date')
      .withFilterConfig(currentUserHasPermissionToFilters ? filterConfig : null)
      .build();
  }
}

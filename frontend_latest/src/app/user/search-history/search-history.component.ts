import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { GroupedSearchHistory, SearchHistoryService } from '@app/services/search-history.service';
import { SeoService } from '@app/services/seo.service';
import { KeyvalueOrderPipe } from '@app/shared/pipes/keyvalue-order.pipe';

/**
 * Search History Component
 */
@Component({
    templateUrl: './search-history.component.html',
    standalone: true,
    imports: [
        NgFor,
        RouterLink,
        LocalizeRouterPipe,
        KeyvalueOrderPipe,
    ],
    providers: [
      SearchHistoryService
    ]
})
export class SearchHistoryComponent implements OnInit {
  /**
   * Router endpoints
   */
  routerEndpoints = RouterEndpoints;

  /**
   * Grouped search history
   */
  groupedSearchHistory: GroupedSearchHistory;
  private service = inject(SearchHistoryService);

  /**
   * @ignore
   */
  constructor(private seoService: SeoService) {}

  /**
   * Get data from backend
   */
  ngOnInit(): void {
    this.seoService.setPageTitleByTranslationKey(['User.SearchHistory', 'MyDashboard.Self']);

    this.service.getGroupedSearchHistory().subscribe(data => {
      this.groupedSearchHistory = data;
    });
  }
}

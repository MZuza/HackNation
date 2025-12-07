import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { DatasetSelectedFiltersComponent } from '../../dataset/dataset-selected-filters/dataset-selected-filters.component';
import { ApplicationsListViewFiltersComponent } from '../application-list-view-filters/applications-list-view-filters.component';
import { ApplicationResultsComponent } from '../application-results/application-results.component';

import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { ApplicationsService } from '@app/services/applications.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { BasicPageParams } from '@app/services/models/page-params';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { FoundResultsCountersAndSortComponent } from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NewDataContactComponent } from '@app/shared/new-data-contact/new-data-contact.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

/**
 * Application Component
 */
@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    standalone: true,
    imports: [
        RouterLink,
        SearchSuggestComponent,
        ApplicationsListViewFiltersComponent,
        DatasetSelectedFiltersComponent,
        NgIf,
        FoundResultsCountersAndSortComponent,
        NotificationsServerComponent,
        NoResultsFoundComponent,
        ApplicationResultsComponent,
        ItemsPerPageComponent,
        PaginationComponent,
        NewDataContactComponent,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class ApplicationComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets;

  /**
   * Array of items (applications)
   */
  items: any[];

  /**
   * Count of items (applications)
   */
  count: number;

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Page setting based on basic params and user interactions
   */
  params: Params;

  /**
   * Basic params of application component
   */
  basicParams: BasicPageParams = {
    sort: '-date',
    page: 1,
    q: '',
    per_page: 5,
  };

  constructor(
    protected filterService: ListViewFiltersService,
    protected selectedFiltersService: ListViewSelectedFilterService,
    protected activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private applicationsService: ApplicationsService,
    private searchService: SearchService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService);

    this.Facets = [AggregationOptionType.SHOWCASE_CATEGORY, AggregationOptionType.SHOWCASE_TYPE, AggregationOptionType.SHOWCASE_PLATFORMS];
  }

  /**
   * Sets META tags (title).
   * Initializes and updates list of items (applications) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Menu.Showcases']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        sort = qParams['q'] ? 'relevance' : this.basicParams['sort'];
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = ApiModel.SHOWCASE;
      }

      const customParams = [{ key: 'model[terms]', value: ApiModel.SHOWCASE }];
      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService
        .getFilters(ApiConfig.search, this.Facets, customParams)
        .subscribe((allFilters: IListViewFilterAggregationsOptions) => {
          this.filters = allFilters;
          this.setSelectedFilters(this.params);
          this.getData();
        });
    });
  }

  /**
   * Gets list of applications
   */
  protected getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.items = response.results;
      this.count = response.count;
    });
  }

  /**
   * returns new empty data model for filters
   * @return {IListViewDatasetFiltersModel}
   */
  protected getFiltersModel(): IListViewApplicationsFiltersModel {
    return {
      [AggregationFilterNames.SHOWCASE_CATEGORY]: {},
      [AggregationFilterNames.SHOWCASE_TYPE]: {},
      [AggregationFilterNames.SHOWCASE_PLATFORMS]: {},
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return (
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_CATEGORY]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_TYPE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_PLATFORMS])
    );
  }

  /**
   * Move to search results list for screen reader
   */
  moveToSearchResult() {
    document.getElementById('search-counters-label').focus();
  }

}

import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InstitutionListViewFiltersComponent } from '../institution-list-view-filters/institution-list-view-filters.component';
import { InstitutionResultsComponent } from '../institution-results/institution-results.component';
import { InstitutionSelectedFiltersComponent } from '../institution-selected-filters/institution-selected-filters.component';

import { toggle, toggleVertically } from '@app/animations';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { InstitutionsService } from '@app/services/institutions.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { IInstitutionSource, InstitutionSourceType } from '@app/services/models/institution';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { ApiSourceLinkComponent } from '@app/shared/api-source-link/api-source-link.component';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { FoundResultsCountersAndSortComponent } from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

/**
 * Institution Component
 */
@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
    animations: [toggle, toggleVertically],
    standalone: true,
    imports: [
        SearchSuggestComponent,
        InstitutionListViewFiltersComponent,
        InstitutionSelectedFiltersComponent,
        NgIf,
        FoundResultsCountersAndSortComponent,
        NotificationsServerComponent,
        InstitutionResultsComponent,
        NoResultsFoundComponent,
        ItemsPerPageComponent,
        PaginationComponent,
        ApiSourceLinkComponent,
        TranslatePipe,
    ],
})
export class InstitutionComponent extends ListViewFilterPageAbstractComponent implements OnInit {

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
    private router: Router,
    private institutionsService: InstitutionsService,
    private seoService: SeoService,
    private searchService: SearchService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService);
  }
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets = [AggregationOptionType.INSTITUTION_TYPE];

  /**
   * Sets META tags (title).
   * Initializes and updates list of items (institutions) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Institutions.Self']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? 'relevance' : 'title';
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = this.apiModel.INSTITUTION;
      }

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService.getFilters(ApiConfig.search, this.Facets).subscribe((allFilters: IListViewFilterAggregationsOptions) => {
        this.filters = allFilters;
        this.setSelectedFilters(this.params);
      });

      this.getData();
    });
  }

  protected getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.items = response.results.map(item => {
        item['source'] =
          item.attributes.sources &&
          item.attributes.sources.find((source: IInstitutionSource) => source.source_type === InstitutionSourceType.CKAN);
        return item;
      });
      this.count = response.count;
      this.selfApi = response.links.self;
    });
  }

  /**
   * returns new empty data model for filters
   * @returns {IListViewInstitutionFiltersModel}
   */
  protected getFiltersModel(): IListViewInstitutionFiltersModel {
    return {
      [AggregationFilterNames.INSTITUTION_TYPE]: {},
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.INSTITUTION_TYPE]);
  }
}

import { AsyncPipe, NgIf } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { toggleVertically } from '@app/animations';
import { DatasetListViewFiltersComponent } from '@app/pages/dataset/dataset-list-view-filters/dataset-list-view-filters.component';
import { DatasetMetadataComponent } from '@app/pages/dataset/dataset-metadata/dataset-metadata.component';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { DatasetSelectedFiltersComponent } from '@app/pages/dataset/dataset-selected-filters/dataset-selected-filters.component';
import { RegionsMapComponent } from '@app/pages/dataset/regions-map/regions-map.component';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { LoginService } from '@app/services/login-service';
import { HttpCustomErrorResponse } from '@app/services/models';
import {
  AggregationFilterNames,
  AggregationOptionType,
  IDatasetListViewFilterAggregationsOptions,
  IListViewFilterAggregationsOptions,
} from '@app/services/models/filters';
import { IAggregationArray } from '@app/services/models/map';
import { IListViewDatasetCategoryFiltersModel, IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { ApiSourceLinkComponent } from '@app/shared/api-source-link/api-source-link.component';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import {
  FoundResultsCountersAndSortComponent
} from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NewDataContactComponent } from '@app/shared/new-data-contact/new-data-contact.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchAdvancedSettings } from '@app/shared/search-suggest/search-suggest';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

/**
 * Dataset Component
 */
@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  animations: [toggleVertically],
  standalone: true,
  imports: [
    TranslatePipe,
    DatasetMetadataComponent,
    NgIf,
    SearchSuggestComponent,
    FormsModule,
    AsyncPipe,
    TooltipDirective,
    RouterLink,
    DatasetListViewFiltersComponent,
    LocalizeRouterPipe,
    DatasetSelectedFiltersComponent,
    RegionsMapComponent,
    FoundResultsCountersAndSortComponent,
    NotificationsServerComponent,
    DatasetResultsComponent,
    NoResultsFoundComponent,
    ItemsPerPageComponent,
    PaginationComponent,
    ApiSourceLinkComponent,
    NewDataContactComponent
  ]
})
export class DatasetComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * All date filter fields
   */
  readonly DateFields = [AggregationFilterNames.DATE_FROM, AggregationFilterNames.DATE_TO];

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets;

  /**
   * sets query form visibility
   */
  isQueryFormVisible = false;

  /**
   * sets if query form is submitted
   */
  isQueryFormSubmitted = false;

  /**
   * sets if query form is subscribed
   */
  isQuerySubscribed = false;

  /**
   * sets if query form has error
   */
  isQueryFormError = false;

  /**
   * Self api of dataset parent component
   */
  selfApi: string;

  /**
   * Default advanced setting
   */
  defaultAdvancedSetting = SearchAdvancedSettings.ANY;

  /**
   * Determines whether user is logged in
   */
  isUserLoggedIn = false;

  /**
   * show map button
   */
  showMap: boolean;

  /**
   * set default location to Poland when open map without choice location in filter
   */
  isDefaultLocation: boolean;

  sortOption: string;

  /**
   * map aggregation array
   */
  mapAggregations: IAggregationArray;

  /**
   * map params regions
   */
  mapMetaParamsRegions: {};

  /**
   * refresh map after user chose a new location
   */
  refreshMap = new BehaviorSubject<{ ref: boolean; changeBbox: boolean }>({ ref: false, changeBbox: false });

  mapBounds: string;

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private datasetService: DatasetService,
    private seoService: SeoService,
    private observeService: ObserveService,
    private userService: UserService,
    public loginService: LoginService,
    private notificationsService: NotificationsService,
    protected selectedFiltersService: ListViewSelectedFilterService,
    private listViewDetailsService: ListViewDetailsService,
    private searchService: SearchService,
    private ngZone: NgZone,
  ) {
    super(filterService, activatedRoute, selectedFiltersService);
    this.Facets = [
      AggregationOptionType.CATEGORIES,
      AggregationOptionType.INSTITUTION,
      AggregationOptionType.FORMAT,
      AggregationOptionType.OPENNESS_SCORE,
      AggregationOptionType.VISUALIZATION_TYPE,
      AggregationOptionType.TYPES,
      AggregationOptionType.LICENSES,
      AggregationOptionType.HIGH_VALUE_DATA,
      AggregationOptionType.HIGH_VALUE_DATA_FROM_EC,
      AggregationOptionType.DYNAMIC_DATA,
      AggregationOptionType.UPDATE_FREQUENCY,
      AggregationOptionType.RESEARCH_DATA,
      AggregationOptionType.LANGUAGE,
      AggregationOptionType.PROTECTED_DATA
    ];
  }

  addSubscriptionToQuery(queryForm: NgForm) {
    if (!queryForm.valid) {
      return;
    }

    this.observeService.addSubscription('query', this.selfApi, queryForm.value.queryInput, this.count).subscribe(
      () => {
        this.isQueryFormSubmitted = true;
        this.isQueryFormError = false;
        this.notificationsService.clearAlerts();
      },
      (errorResponse: HttpCustomErrorResponse) => {
        this.isQueryFormSubmitted = false;
        this.notificationsService.clearAlerts();
        this.isQueryFormError = this.datasetService.isQueryError(errorResponse);
      },
    );
  }

  /**
   * Sets META tags (title).
   * Initializes default filters.
   * Initializes and updates list of items (datasets) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Datasets.Self']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };
    this.isUserLoggedIn = this.userService.isLoggedIn();

    let customParams = [{ key: 'model[terms]', value: 'dataset,resource' }];

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? 'relevance' : '-date';
      }

      this.params = {
        ...qParams,
        ...this.filterService.updateBasicParams(qParams, this.basicParams, sort),
      };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = 'dataset,resource';
      }

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      if (
        qParams['regions[id][terms]'] &&
        !customParams.find(elem => elem.key === 'filtered_facet[by_regions]') &&
        !this.selectedFilters[AggregationFilterNames.REGIONS][Object.keys(this.selectedFilters[AggregationFilterNames.REGIONS])[0]]
      ) {
        customParams = [...customParams, { key: 'filtered_facet[by_regions]', value: qParams['regions[id][terms]'] }];
      }

      this.searchService
        .getFilters(ApiConfig.search, this.Facets, customParams)
        .subscribe((allFilters: IDatasetListViewFilterAggregationsOptions | IListViewFilterAggregationsOptions) => {
          this.filters = allFilters;
          this.setSelectedFilters(this.params);
          this.getData();
        });
    });
  }

  /**
   * Move to search results list for screen reader
   */
  moveToSearchResult(): void {
    document.getElementById('search-counters-label').focus();
  }

  /**
   * Back to search input for screen reader
   */
  backToSearchControl(): void {
    const elem = <HTMLElement>document.getElementsByClassName('search-suggest__input')[0];
    elem.focus();
  }

  /**
   * Gets list of datasets
   */
  protected getData(): void {
    if (this.params['isMapOpen'] === 'true') {
      this.preparedParamsForDefaultLocation();
    }

    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.setData(response);
      this.mapAggregations = response.aggregations;
      this.mapMetaParamsRegions = response.params.regions;
      this.resetMapMetaParamsRegionsIfNeeded();
      if (this.showMap && this.params['isMapOpen'] !== 'true') {
        this.mapMetaParamsRegions ? (this.isDefaultLocation = false) : (this.isDefaultLocation = true);
        this.refreshMap.next({ ref: true, changeBbox: false });
      }
      if (this.params['isMapOpen'] === 'true') {
        this.params['regions[id][terms]'] !== '85633723' && !this.params['regions[bbox][geo_shape]']
          ? this.setParamsForMap(false)
          : this.setParamsForMap(true);
      }
    });
  }

  /**
   * Gets list of datasets from boundary box
   */
  getDataFromMap(event): void {
    if (event.resp.data) {
      const response = event.resp;
      this.mapBounds = event.mapBounds;
      this.ngZone.run(() => {
        this.items = this.listViewDetailsService.extendViewDetails(response.data);
        this.counters = response.meta.aggregations.counters;
        this.count = response.meta.count;
      });
    } else {
      this.items = null;
    }
  }

  /**
   * show map event
   */
  onShowMap(): void {
    if (!this.mapAggregations.map_by_regions) {
      if (this.mapMetaParamsRegions) {
        this.setParamsForMap(false);
      } else {
        this.preparedParamsForDefaultLocation();

        this.searchService.getData(ApiConfig.search, this.params).subscribe(resp => {
          this.mapAggregations = resp.aggregations;
          this.setParamsForMap(true);
        });
      }
    } else {
      this.mapMetaParamsRegions ? this.setParamsForMap(false) : this.setParamsForMap(true);
    }
  }

  onHideMap(event): void {
    this.showMap = !event;
    if (this.params['regions[bbox][geo_shape]']) {
      this.params['regions[bbox][geo_shape]'] = '9.360087936473064,55.825973254619015,30.431865280223064,47.69497434186282,6';
      this.updateSelectedFiltersForMap(14.122885, 54.836417, 24.145783, 49.002047);
      this.mapBounds = undefined;
      this.refreshMap.next({ ref: true, changeBbox: true });
    }
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.setData(response);
    });
  }

  private setData(response): void {
    let results = response.results ? response.results : [];
    this.counters = response.aggregations.counters;
    if (this.filters) {
      results = this.addInsitutions(results);
    }
    this.items = this.listViewDetailsService.extendViewDetails(results);
    this.count = response.count;
    this.selfApi = response.links.self;
    this.isQueryFormVisible = this.count && ((this.params && this.params.q && this.params.q.length) || this.selectedFiltersCount);
    this.isQueryFormSubmitted = false;
    this.isQueryFormError = false;
    this.isQuerySubscribed = !!response.subscription_url;
  }

  /**
   * returns new empty data model for filters
   * @return {IListViewDatasetFiltersModel}
   */
  protected getFiltersModel(): IListViewDatasetFiltersModel | IListViewDatasetCategoryFiltersModel {
    // @ts-ignore
    return {
      [AggregationFilterNames.CATEGORIES]: {},
      [AggregationFilterNames.INSTITUTION]: {},
      [AggregationFilterNames.FORMAT]: {},
      [AggregationFilterNames.OPENNESS_SCORE]: {},
      [AggregationFilterNames.VISUALIZATION_TYPE]: {},
      [AggregationFilterNames.TYPES]: {},
      [AggregationFilterNames.LICENSES]: {},
      [AggregationFilterNames.UPDATE_FREQUENCY]: {},
      [AggregationFilterNames.HIGH_VALUE_DATA]: {},
      [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: {},
      [AggregationFilterNames.DATE_FROM]: null,
      [AggregationFilterNames.DATE_TO]: null,
      [AggregationFilterNames.REGIONS]: {},
      [AggregationFilterNames.DYNAMIC_DATA]: {},
      [AggregationFilterNames.RESEARCH_DATA]: {},
      [AggregationFilterNames.LANGUAGE]: {},
      [AggregationFilterNames.PROTECTED_DATA]: {}
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    if (this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.REGIONS]) === 0) {
      this.showMap = false;
    }

    return (
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.CATEGORIES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.INSTITUTION]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.FORMAT]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.OPENNESS_SCORE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.VISUALIZATION_TYPE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.TYPES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.LICENSES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.UPDATE_FREQUENCY]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.HIGH_VALUE_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.REGIONS]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.DYNAMIC_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.RESEARCH_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.LANGUAGE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.PROTECTED_DATA]) +
      (this.backupSelectedFilters[AggregationFilterNames.DATE_FROM] || this.backupSelectedFilters[AggregationFilterNames.DATE_TO] ? 1 : 0)
    );
  }

  /**
   * adds institution when relationships is available in the model
   * @param {any[]} results
   * @returns {any[]}
   */
  private addInsitutions(results: any[]): any[] {
    let institutionData;
    let institutionLinkRelated;
    let lastCommaIndex;

    return results.map(dataset => {
      if (dataset.relationships) {
        institutionData = dataset.relationships.institution;
        dataset.institution = this.filters[AggregationOptionType.INSTITUTION].find(institution => {
          return institutionData.data.type === this.apiModel.INSTITUTION && institutionData.data.id === institution.id;
        });

        if (dataset.institution) {
          institutionLinkRelated = institutionData.links.related;
          lastCommaIndex = institutionLinkRelated.lastIndexOf(',');
          dataset.institution.slug = institutionLinkRelated.slice(lastCommaIndex + 1, institutionLinkRelated.length);
        }
      }

      return dataset;
    });
  }

  /**
   * prepared params for Poland location if location filter is unset
   */
  private preparedParamsForDefaultLocation(): void {
    if (!this.params['regions[id][terms]']) {
      const northWestLng = this.mapBounds ? this.mapBounds.split(',')[0] : 14.122885;
      const northWestLat = this.mapBounds ? this.mapBounds.split(',')[1] : 54.836417;
      const southEastLng = this.mapBounds ? this.mapBounds.split(',')[2] : 24.145783;
      const southEastLat = this.mapBounds ? this.mapBounds.split(',')[3] : 49.002047;
      this.params = {
        ...this.params,
        'regions[bbox][geo_shape]': this.mapBounds
          ? this.mapBounds
          : '9.360087936473064,55.825973254619015,30.431865280223064,47.69497434186282,6',
      };
      this.updateSelectedFiltersForMap(northWestLng, northWestLat, southEastLng, southEastLat);
    }
  }

  /**
   * set parameters for map
   * @param {boolean} isDefaultLocation
   */
  private setParamsForMap(isDefaultLocation: boolean): void {
    this.showMap = true;
    this.isDefaultLocation = isDefaultLocation;
  }

  private updateSelectedFiltersForMap(northWestLng, northWestLat, southEastLng, southEastLat): void {
    this.selectedFilters[AggregationFilterNames.REGIONS] = {
      '85633723': {
        bbox: [
          [northWestLng, northWestLat],
          [southEastLng, southEastLat],
        ],
        title: 'Polska',
        id: '85633723',
      },
    };
  }

  private resetMapMetaParamsRegionsIfNeeded(): void {
    if (this.mapMetaParamsRegions) {
      if (this.mapMetaParamsRegions['bbox']) {
        this.mapMetaParamsRegions = undefined;
      } else {
        if (this.mapMetaParamsRegions['id']['terms'] === '85633723') {
          this.mapMetaParamsRegions = undefined;
        }
      }
    }
  }

}

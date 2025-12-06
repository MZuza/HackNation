import { ActivatedRoute, Params, QueryParamsHandling } from '@angular/router';

import { APP_CONFIG } from '@app/app.config';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import {
  IListViewFilterAggregationsOptions,
  MultiselectOption,
  SelectedFilter,
  SingleselectOptionForRegions,
} from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';
import {
  IListViewInstitutionItemCategoryFiltersModel,
  IListViewInstitutionItemFiltersModel,
} from '@app/services/models/page-filters/institution-item-filters';
import { BasicPageParams, PageParams } from '@app/services/models/page-params';
import { ISearchCounters } from '@app/services/models/search';

/**
 * Abstract class for page which uses List View filters
 */
export abstract class ListViewFilterPageAbstractComponent {
  /**
   * Stored selected filters
   */
  backupSelectedFilters:
    | IListViewDatasetFiltersModel
    | IListViewInstitutionFiltersModel
    | IListViewInstitutionItemFiltersModel
    | IListViewInstitutionItemCategoryFiltersModel
    | IListViewApplicationsFiltersModel;

  /**
   * Selected filters
   */
  selectedFilters:
    | IListViewDatasetFiltersModel
    | IListViewInstitutionFiltersModel
    | IListViewInstitutionItemFiltersModel
    | IListViewInstitutionItemCategoryFiltersModel
    | IListViewApplicationsFiltersModel;

  /**
   * Default filters of dataset component
   */
  filters: IListViewFilterAggregationsOptions;

  /**
   * Selected filters count
   */
  selectedFiltersCount = 0;

  /**
   * Array of items
   */
  items: any[];

  /**
   * Count of items
   */
  count: number;

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Page settings based on basic params and user interactions
   */
  params: Params;

  /**
   * Basic params of dataset component
   */
  basicParams: BasicPageParams = {
    sort: 'relevance',
    page: 1,
    q: '',
    per_page: 20,
  };

  /**
   * Max length of search input
   */
  maxLength = APP_CONFIG.searchInputMaxLength;

  /**
   * Counters of items by type
   */
  counters: ISearchCounters;

  /**
   * Abstract date filter fields
   */
  readonly DateFields = [];

  /**
   * initial value for region input (after refresh if exists)
   */
  initialRegionValue: string;

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
  ) {}

  /**
   * Clears selected filter and updates query
   * @param { SelectedFilter} filter
   * @param isMapOpen
   */
  clearSelectedFilter(filter: SelectedFilter, isMapOpen?: boolean) {
    let updatedQueryParams: PageParams = this.selectedFiltersService.removeSelectedFilter(
      filter,
      this.activatedRoute.snapshot.queryParams,
      this.backupSelectedFilters,
    );

    if (filter.names === 'regions') {
      (<HTMLInputElement>document.getElementById('regions-search-input')).value = '';
      this.initialRegionValue = '';
      updatedQueryParams = { ...updatedQueryParams, isMapOpen: isMapOpen };
    }

    this.filterService.updateParams(updatedQueryParams, null, this.basicParams, this.params);
  }

  /**
   * Performs search
   * @param {BasicPageParams} params
   */
  performSearch(params: BasicPageParams) {
    this.filterService.performSearch(params, this.basicParams, this.params);
  }

  /**
   * Clears selected filters
   */
  clearSelectedFilters() {
    this.resetSelectedFilters();
    this.updateParams({}, null);
  }

  /**
   * Updates query params on every user interaction
   * @param params
   * @param {QueryParamsHandling | null} method
   * @param {boolean} shouldAddSuffix
   */
  updateParams(params: PageParams, method: QueryParamsHandling | null = 'merge', shouldAddSuffix = false) {
    let preparedParams: PageParams;
    if (shouldAddSuffix) {
      preparedParams = this.filterService.prepareParamsBeforeUpdate(params, this.DateFields);
    } else {
      preparedParams = params;
    }
    this.filterService.updateParams(preparedParams, method, this.basicParams, this.params);
  }

  /**
   * Sets selected filters based on query params
   * @param {PageParams} queryParams
   */
  protected setSelectedFilters(queryParams: PageParams) {
    const newSelectedFilters = this.filterService.setSelectedFilters(
      queryParams,
      this.DateFields,
      this.filters,
      this.selectedFilters,
      this.params,
    );

    this.backupSelectedFilters = { ...newSelectedFilters } as IListViewDatasetFiltersModel;
    this.selectedFilters = { ...newSelectedFilters } as IListViewDatasetFiltersModel;
    this.selectedFiltersCount = this.getSelectedFiltersCount();
    if (this.selectedFilters.regions && !this.selectedFilters.regions[Object.keys(this.selectedFilters.regions)[0]].hierarchy_label) {
      this.initialRegionValue = this.selectedFilters.regions[Object.keys(this.selectedFilters.regions)[0]].title;
    }
  }

  /**
   * Resets selected filters
   */
  protected resetSelectedFilters() {
    this.backupSelectedFilters = this.getFiltersModel();
    this.selectedFiltersCount = 0;
    const regionsSearchInput = <HTMLInputElement>document.getElementById('regions-search-input');
    if (regionsSearchInput) {
      (<HTMLInputElement>document.getElementById('regions-search-input')).value = '';
      this.initialRegionValue = '';
    }
  }

  /**
   * Checks whether default page params already exist
   * @param {Params} params
   * @returns {boolean}
   */
  protected allBasicParamsIn(params: Params): boolean {
    return this.filterService.allBasicParamsIn(params, this.basicParams);
  }

  /**
   * gets one particular selected filter count
   * @param {MultiselectOption} filters
   */
  protected getSelectedFilterCount(filters: MultiselectOption | SingleselectOptionForRegions) {
    return filters ? Object.keys(filters).length : 0;
  }

  /**
   * Abstract function for getting results
   */
  protected abstract getData();

  /**
   * Abstract function for getting filter model
   */
  protected abstract getFiltersModel();

  /**
   * Abstract function for getting selected filters count
   */
  protected abstract getSelectedFiltersCount();
}

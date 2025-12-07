import { Injectable } from '@angular/core';
import { Params, QueryParamsHandling, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import _ from 'underscore';

import {
  AggregationFilterNames,
  AggregationOptionType,
  IAggregationProperties,
  IListViewFilterAggregationsOptions,
} from '@app/services/models/filters';
import { BasicPageParams, PageParams } from '@app/services/models/page-params';

/**
 *  Filter services that prepares aggregation filters before its use.
 */
@Injectable({
  providedIn: 'root',
})
export class ListViewFiltersService {
  constructor(private router: Router, private translate: TranslateService) {}

  /**
   * Returns filter name with [terms] or [id][terms] suffix
   * @param {string} name
   * @return {string}
   */
  addTermsSuffix(name: string): string {
    let filterNameWithSuffix: string;

    switch (name) {
      case AggregationFilterNames.CATEGORIES:
      case AggregationFilterNames.INSTITUTION:
      case AggregationFilterNames.REGIONS:
        filterNameWithSuffix = name + '[id][terms]';
        break;
      case AggregationFilterNames.HIGH_VALUE_DATA:
      case AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC:
      case AggregationFilterNames.DYNAMIC_DATA:
      case AggregationFilterNames.RESEARCH_DATA:
      case AggregationFilterNames.PROTECTED_DATA:
        filterNameWithSuffix = name + '[term]';
        break;
      default:
        filterNameWithSuffix = name + '[terms]';
        break;
    }

    return filterNameWithSuffix;
  }

  /**
   * Returns filter name with 'by_' prefix
   * @param {string} name
   * @return {string}
   */
  addByPrefix(name: string): string {
    return `by_${name === AggregationFilterNames.INSTITUTION_TYPE ? AggregationFilterNames.INSTITUTION_TYPE : name}`;
  }

  /**
   * Update default params
   * @param {Params} newParams
   * @param {Params} defaultParams
   * @param {string} sort
   * @return {Params}
   */
  updateBasicParams(newParams: Params, defaultParams: Params, sort = ''): Params {
    return {
      page: +newParams['page'] || defaultParams['page'],
      per_page: +newParams['per_page'] || defaultParams['per_page'],
      q: newParams['q'] || '',
      sort: newParams['sort'] || sort,
    };
  }

  /**
   * Prepare filters: sort, add openness score symbols and missing title property
   * @param {IListViewFilterAggregationsOptions} filters
   * @return {IListViewFilterAggregationsOptions}
   */
  prepareFilters(filters: IListViewFilterAggregationsOptions): IListViewFilterAggregationsOptions {
    if (filters[AggregationOptionType.INSTITUTION_TYPE]) {
      this.translateInstitutionTypes(filters[AggregationOptionType.INSTITUTION_TYPE]);
    }

    this.sortFiltersByTitle(filters);

    if (filters[AggregationOptionType.OPENNESS_SCORE]) {
      this.addStarsForOpennessScore(filters[AggregationOptionType.OPENNESS_SCORE]);
    }

    if (filters[AggregationOptionType.VISUALIZATION_TYPE]) {
      this.translateVisualizationTypes(filters[AggregationOptionType.VISUALIZATION_TYPE]);
    }

    if (filters[AggregationOptionType.TYPES]) {
      this.translateTypes(filters[AggregationOptionType.TYPES]);
    }

    return filters;
  }

  /**
   * Prepare params for routing by adding necessary sufix for name
   * @param {PageParams} params
   * @param {string []} dateFields
   * @return {PageParams}
   */
  prepareParamsBeforeUpdate(params: PageParams, dateFields: string[] = []): PageParams {
    const newParams: PageParams = Object.assign({}, params);
    Object.keys(newParams).forEach((key: string) => {
      if (!dateFields.includes(key)) {
        const nameWithTerms = this.addTermsSuffix(key);
        newParams[nameWithTerms] = newParams[key];
        delete newParams[key];
      }
    });

    return newParams;
  }

  /**
   * Updates query params on every user interaction
   * @param {PageParams | BasicPageParams} updatedParams
   * @param {QueryParamsHandling | null} method
   * @param {BasicPageParams} basicParams
   * @param {PageParams} paramsIn
   */
  updateParams(
    updatedParams: PageParams | BasicPageParams,
    method: QueryParamsHandling | null = 'merge',
    basicParams: BasicPageParams,
    paramsIn: PageParams,
  ) {
    // default sort
    if ('sort' in updatedParams && !updatedParams.sort) {
      updatedParams.sort = basicParams.sort;
    }

    const updatedBasicParams = {
      page: +paramsIn.page || basicParams.page,
      per_page: +paramsIn.per_page || basicParams.per_page,
      q: paramsIn.q || '',
      sort: paramsIn.sort || '',
    };

    if (!('page' in updatedParams)) {
      updatedParams.page = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...updatedParams,
      },
      queryParamsHandling: method,
    }).then();
  }

  /**
   * Performs search
   * @param {BasicPageParams } params
   * @param {BasicPageParams} basicParams
   * @param {PageParams} paramsIn
   */
  performSearch(params: BasicPageParams, basicParams: BasicPageParams, paramsIn: PageParams) {
    if (!('q' in params)) {
      return;
    }

    params['q'] = (<string>params['q']).trim();
    const param = params['q'].length ? params : { q: '' };

    this.updateParams(param, 'merge', basicParams, paramsIn);
  }

  /**
   * Sets chosen filters
   * @param {PageParams} queryParams
   * @param {string []} dateFields
   * @param {Params} options
   * @param {Params} selectedFilters
   * @param {BasicPageParams} params
   * @return {Params}
   */
  setSelectedFilters(
    queryParams: PageParams,
    dateFields: string[],
    options: Params,
    selectedFilters: Params,
    params: BasicPageParams,
  ): Params {
    if (!options) {
      return;
    }

    params = params ? params : {};

    const newSelectedFilters = Object.assign({}, selectedFilters);

    for (const name of Object.keys(newSelectedFilters)) {
      if (dateFields.includes(name)) {
        newSelectedFilters[name] = queryParams[name] ? new Date(queryParams[name]) : null;
        continue;
      }

      const nameWithTerms = this.addTermsSuffix(name);
      const byName = this.addByPrefix(name);

      if (queryParams[nameWithTerms]) {
        params[nameWithTerms] = queryParams[nameWithTerms];
        const filterValues = queryParams[nameWithTerms].split(',');

        if (options[byName]) {
          const newValues = options[byName].filter(item => {
            return filterValues.indexOf(item.id) !== -1;
          });
          newValues.forEach(val => {
            newSelectedFilters[name][val.id] = val;
          });
        }
      } else {
        delete newSelectedFilters[name];
      }
    }

    return newSelectedFilters;
  }

  /**
   * Checks whether default page params already exist
   * @param {Params} params
   * @param {BasicPageParams} basicParams
   * @returns {boolean}
   */
  allBasicParamsIn(params: Params, basicParams: BasicPageParams): boolean {
    for (const key of Object.keys(basicParams)) {
      if (!(key in params)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks whether item (result) list is sorted by date
   * @param {BasicPageParams} params
   * @returns {boolean}
   */
  checkSortByDate(params: BasicPageParams): boolean {
    const sort = params.sort;
    return sort && (sort.indexOf('created') !== -1 || sort.indexOf('verified') !== -1);
  }

  /**
   * Sort filters by title
   * @param {IListViewFilterAggregationsOptions} filters
   */
  private sortFiltersByTitle(filters: IListViewFilterAggregationsOptions) {
    for (const key in filters) {
      if (filters[key]) {
        if (filters[key].length) {
          if (key === AggregationOptionType.CATEGORIES) {
            filters[key] = filters[key].sort((a, b) => {
              return a['title'].localeCompare(b['title']);
            });
          } else {
            this.addMissingTitle(filters[key]);
            filters[key] = _.sortBy(filters[key], 'title');
          }
        }
      }
    }
  }

  /**
   * Add stars symbols as title to openness score filter
   * @param {IAggregationProperties} filtersByOpennessScore
   */
  private addStarsForOpennessScore(filtersByOpennessScore: IAggregationProperties[]) {
    filtersByOpennessScore.forEach(item => {
      item.title = '';
      item.titleTranslationKey = 'Attribute.OpennessScore';

      for (let i = 0; i < 5; i++) {
        item.title += i < +item.id ? '&#x2605; ' : '&#x2606; ';
      }
    });
  }

  /**
   * translate all Institution types titles
   * @param {IAggregationProperties[]} filtersByInstitutionTypes
   */
  private translateInstitutionTypes(filtersByInstitutionTypes: IAggregationProperties[]) {
    const ids = ['state', 'local', 'other', 'private', 'developer'];
    const translateKeys = [
      'Institutions.TypeState',
      'Institutions.TypeLocal',
      'Institutions.TypeOther',
      'Institutions.TypePrivate',
      'Institutions.TypeDevelopers'
    ];
    this.translateFilters(filtersByInstitutionTypes, ids, translateKeys);
  }

  /**
   * translate all Visualization types titles
   * @param {IAggregationProperties[]} filtersByVisualizationTypes
   */
  private translateVisualizationTypes(filtersByVisualizationTypes: IAggregationProperties[]) {
    const ids = ['map', 'chart', 'none', 'table'];
    const translateKeys = [
      'VisualizationTypesFilters.Map',
      'VisualizationTypesFilters.Chart',
      'VisualizationTypesFilters.None',
      'VisualizationTypesFilters.Table',
    ];
    this.translateFilters(filtersByVisualizationTypes, ids, translateKeys);
  }

  /**
   * translate all Types titles
   * @param {IAggregationProperties[]} filtersByTypes
   */
  private translateTypes(filtersByTypes: IAggregationProperties[]) {
    const ids = ['api', 'file', 'website'];
    const translateKeys = ['TypesFilters.Api', 'TypesFilters.File', 'TypesFilters.Website'];
    this.translateFilters(filtersByTypes, ids, translateKeys);
  }

  /**
   * translate Filters
   * @param {IAggregationProperties[]} filters
   * @param {string[]} filterIds
   * @param {string[]} translateKeys
   */
  private translateFilters(filters: IAggregationProperties[], filterIds: string[], translateKeys: string[]) {
    let idIndex = null;
    filters.forEach(item => {
      filterIds.some((id: string, index: number) => {
        if (item.id === id) {
          idIndex = index;
          return true;
        }
      });

      if (idIndex !== null) {
        item.title = this.translate.instant(translateKeys[idIndex]);
      }
      idIndex = null;
    });
  }

  /**
   * Add missing title property to filter
   * @param {IAggregationProperties} elements
   */
  private addMissingTitle(elements: IAggregationProperties[]) {
    elements.forEach(el => {
      if (!el.title) {
        el.title = el.id.toString();
      }
    });
  }
}

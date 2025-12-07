import { Injectable } from '@angular/core';

import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { SelectedFilter } from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';
import {
  IListViewInstitutionItemCategoryFiltersModel,
  IListViewInstitutionItemFiltersModel,
} from '@app/services/models/page-filters/institution-item-filters';
import { PageParams } from '@app/services/models/page-params';

@Injectable({
  providedIn: 'root',
})
export class ListViewSelectedFilterService {
  constructor(private filterService: ListViewFiltersService) {}

  /**
   * Remove selected filter and returns updated object
   * @param {SelectedFilter } { names, key, isDate }
   * @param {Params} queryParams
   * @param {IListViewDatasetFiltersModel | IListViewInstitutionFiltersModel} selectedIds
   * @return {PageParams}
   */
  removeSelectedFilter(
    { names, key, isDate }: SelectedFilter,
    queryParams: PageParams,
    selectedIds:
      | IListViewDatasetFiltersModel
      | IListViewInstitutionFiltersModel
      | IListViewInstitutionItemFiltersModel
      | IListViewInstitutionItemCategoryFiltersModel
      | IListViewApplicationsFiltersModel,
  ): PageParams {
    const updatedQueryParams: PageParams = Object.assign({}, queryParams);
    if (names instanceof Array) {
      names.forEach(name => {
        delete selectedIds[name];
        delete updatedQueryParams[name];
      });
    } else {
      const mappedName: string = this.filterService.addTermsSuffix(names);
      const paramValues: string[] = this.removeSingleParam(updatedQueryParams, mappedName, key);
      delete selectedIds[names][key];

      if (paramValues.length > 0) {
        updatedQueryParams[mappedName] = paramValues.join(',');
      } else {
        delete updatedQueryParams[mappedName];
      }
    }
    updatedQueryParams['page'] = 1;

    return updatedQueryParams;
  }

  /**
   * helper function which removes one id from property and returns remaining ids
   * @param {PageParams } updatedQueryParams
   * @param {string} nameWithSuffix
   * @param {string} idToRemove
   * @return {string []}
   */
  private removeSingleParam(updatedQueryParams: PageParams, nameWithSuffix: string, idToRemove: string): string[] {
    const id = Number.isNaN(+idToRemove) ? idToRemove : +idToRemove;
    const paramValues = updatedQueryParams[nameWithSuffix].split(',').map(value => (Number.isNaN(+value) ? value : +value));
    paramValues.splice(paramValues.indexOf(id), 1);

    return paramValues;
  }
}

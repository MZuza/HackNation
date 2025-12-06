import { Injectable } from '@angular/core';
import moment from 'moment';

import { DaterangeFilterService } from '@app/services/filters/daterange-filter.service';
import { MultiselectFilterService } from '@app/services/filters/multiselect-filter.service';
import {
  AvailabilityFilterMap,
  DaterangeFilterAvailability,
  DaterangeFilterModel,
  DaterangeFilterUpdated,
  FilterModel,
  FiltersToSend,
  IAggregationProperties,
  IAggregationPropertiesForRegions,
  MultiselectOption,
} from '@app/services/models/filters';

/**
 * General service for managing List view fitlers
 * Combines service for datarange and multiselect
 */
@Injectable({
  providedIn: 'root',
})
export class ListViewManageFiltersService {
  constructor(private daterangeFilterService: DaterangeFilterService, private multiselectFilterService: MultiselectFilterService) {}

  /**
   * builds availibility model for all filters
   * @param {string []} keys
   * @returns {AvailabilityFilterMap}
   */
  buildAvailibilityMap(keys: string[]): AvailabilityFilterMap {
    const newSelectedMap: AvailabilityFilterMap = {};
    Object.keys(keys).forEach(key => {
      newSelectedMap[key] = false;
    });

    return newSelectedMap;
  }

  /**
   * Prepares filters ids to send by building {key: id} model for each filter
   * @param {string []} optionGroupNames
   * @param {FilterModel} selectedFilters
   * @returns {FiltersToSend}
   */
  prepareToApply(optionGroupNames: string[], selectedFilters): FiltersToSend {
    const filtersToSend: FiltersToSend = {};
    optionGroupNames.forEach((name: string) => {
      let ids;
      if (selectedFilters && selectedFilters[name]) {
        if (typeof selectedFilters[name] !== 'object' || selectedFilters[name] instanceof Date) {
          filtersToSend[name] = moment(selectedFilters[name]).format('YYYY-MM-DD');
        } else {
          ids = Object.entries(selectedFilters[name]);
        }
      }
      if (ids && ids.length > 0) {
        filtersToSend[name] = ids.map(item => item[0]).join(',');
      }
    });

    return filtersToSend;
  }

  /**
   * helper function to change multiselect filter value
   * @param {MultiselectOption} selectedIds
   * @param {IAggregationProperties} selectedOption
   * @returns {MultiselectOption}
   */
  changeMultiselectFilter(selectedIds: MultiselectOption, selectedOption: IAggregationProperties) {
    return this.multiselectFilterService.changeMultiselect(selectedIds, selectedOption);
  }

  changeSingleselectFilter(selectedOption: IAggregationPropertiesForRegions) {
    return this.multiselectFilterService.changeSingleselect(selectedOption);
  }

  /**
   * helper function which returns if multiselect filter has changed
   * @param {MultiselectOption} changedData
   * @param {MultiselectOption} initialData
   * @returns {boolean}
   */
  checkIfMultiselectChanged(changedData: MultiselectOption, initialData: MultiselectOption): boolean {
    return this.multiselectFilterService.getAvailability(changedData, initialData);
  }

  /**
   * helper function to change daterange filter value
   * @param {DaterangeFilterUpdated []} data
   * @returns {DaterangeFilterModel}
   */
  changeDaterangeFilter(data: DaterangeFilterUpdated[]): DaterangeFilterModel {
    return this.daterangeFilterService.changeDaterange(data);
  }

  /**
   * helper function which returns updated availability model
   * @param {DaterangeFilterUpdated []} previousDaterange
   * @param {DaterangeFilterModel} newDaterange
   * @param {FilterModel} originalSelectedData
   * @returns {DaterangeFilterAvailability}
   */
  getDaterangeAvailability(
    previousDaterange: DaterangeFilterUpdated[],
    newDaterange: DaterangeFilterModel,
    originalSelectedData: FilterModel,
  ): DaterangeFilterAvailability {
    const initialDate: DaterangeFilterModel = {};
    previousDaterange.forEach((date: DaterangeFilterUpdated) => {
      initialDate[date.name] = originalSelectedData[date.name] as Date;
    });

    return this.daterangeFilterService.getAvailability(newDaterange, initialDate);
  }
}

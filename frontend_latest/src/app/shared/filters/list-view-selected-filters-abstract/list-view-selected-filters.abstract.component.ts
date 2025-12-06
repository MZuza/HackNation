import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AggregationFilterNames, SelectedFilter } from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';

/**
 * Abstract Component for List View selected filters
 */
@Component({
    template: '',
    standalone: true
})
export class ListViewSelectedFiltersAbstractComponent {
  /**
   * All filters names
   */
  readonly AggregationFilterNames = AggregationFilterNames;
  /**
   * number of selected filters
   */
  @Input() selectedFiltersCount: number;

  /**
   * map of selected filters
   */
  @Input() selectedIds: IListViewDatasetFiltersModel | IListViewInstitutionFiltersModel | IListViewApplicationsFiltersModel | {};

  /**
   * clear all filters event
   */
  @Output() clearAllFilters = new EventEmitter<void>();

  /**
   * clear only one filter event
   */
  @Output() clearSingleFilter = new EventEmitter<SelectedFilter>();

  /**
   * clear all filters
   */
  clearFilters() {
    this.clearAllFilters.emit();
  }

  /**
   * clear one filter
   * @param {string | string []} names
   * @param {string} key
   * @param {boolean} isDate
   */
  onClearFilter(names: string | string[], key: string, isDate = false) {
    this.clearSingleFilter.emit({ names: names, key: key, isDate: isDate });
  }
}

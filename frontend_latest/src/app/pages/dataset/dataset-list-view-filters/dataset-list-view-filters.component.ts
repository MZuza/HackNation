import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetListViewFilterNames } from '@app/services/models/page-filters/dataset-filters';
import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Dataset filter wrapper for all components
 */
@Component({
  selector: 'app-dataset-list-view-filters',
  templateUrl: './dataset-list-view-filters.component.html',
  standalone: true,
  imports: [
    ExpandableMultiselectComponent,
    DateRangePickerComponent,
    InfoTooltipDirective,
    TranslateModule
  ]
})
export class DatasetListViewFiltersComponent extends ListViewFilterAbstractComponent {
  @Input() showHideMapButton = false;
  @Input() initialValue: string;
  @Output() showMapEmit = new EventEmitter<boolean>();

  updateFrequencySortingOrder: string[] = [
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'everyHalfYear',
    'yearly',
    'irregular',
    'notPlanned',
    'notApplicable'
  ];
  /**
   * invokes applyFilter from extended component with dataset filter names
   */
  applyFilter() {
    super.applyFilter(DatasetListViewFilterNames);
  }
}

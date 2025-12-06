import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateDateFormatPipe } from '../../pipes/translate-date-format.pipe';
import { StarRatingComponent } from '../../star-rating/star-rating.component';
import { RemoveButtonComponent } from './remove-button/remove-button.component';

import { IAggregationProperties, IAggregationPropertiesForRegions } from '@app/services/models/filters';
import { StartEndDateRange } from '@app/services/models/startEndDateRange';

/**
 * Custom view Component for all selected filters
 */
@Component({
    selector: 'app-selected-filters',
    templateUrl: './selected-filters.component.html',
    standalone: true,
    imports: [
        NgIf,
        RemoveButtonComponent,
        NgFor,
        StarRatingComponent,
        AsyncPipe,
        KeyValuePipe,
        TranslatePipe,
        TranslateDateFormatPipe,
    ],
})
export class SelectedFiltersComponent {
  /**
   * all selected filters
   */
  @Input() items: { [key: string]: IAggregationProperties; value: any } | StartEndDateRange;

  /**
   * selected filter for regions
   */
  @Input() regions: { [key: string]: IAggregationPropertiesForRegions; value: any } | StartEndDateRange;

  /**
   * if filter is a date
   */
  @Input() isDateType = false;

  /**
   * if filter is a 'star' type
   */
  @Input() isStarsType = false;

  /**
   * if filter is custom (height value data and dynamic data)
   */
  @Input() isCustomFilterName = false;

  /**
   * filter custom name (height value data and dynamic data)
   */
  @Input() customFiltersName: string;

  /**
   * if filter is a region data
   */
  @Input() isRegionsData = false;

  /**
   * event for removing filter
   */
  @Output() removeSelectedFilter = new EventEmitter<string>();

  /**
   * emits key by triggering change on removeSelectedFilter
   * @param {string} key
   */
  onRemoveSelectedFilter(key: string) {
    this.removeSelectedFilter.next(key);
  }
}

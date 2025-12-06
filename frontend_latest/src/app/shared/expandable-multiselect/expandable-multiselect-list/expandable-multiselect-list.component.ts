import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IAggregationProperties, MultiselectOption } from '@app/services/models/filters';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Expandable list view for filters
 */
@Component({
    selector: 'app-expandable-multiselect-list',
    templateUrl: './expandable-multiselect-list.component.html',
    standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    TranslatePipe,
    SanitizeHtmlPipe,
  ],
})
export class ExpandableMultiselectListComponent implements OnChanges {
  /**
   * id for list elements
   */
  readonly generatedId = StringHelper.generateRandomHex();

  /**
   * holds css class to expand or hide options
   */
  expandedClass = '';

  /**
   * filter options
   */
  @Input() options: IAggregationProperties[];

  /**
   * selected filter Options by {ket: value}
   */
  @Input() selectedIds: MultiselectOption = {};

  /**
   * value that should be displayed
   */
  @Input() displayValue = 'title';

  /**
   * determine if options should be displayed
   */
  @Input() isExpanded = false;

  /**
   * shows search filter input
   */
  @Input() showSearchInput = false;

  /**
   * set filter name for automatic test
   */
  @Input() filterName: string;

  /**
   * emits new option selection change
   */
  @Output() selectedChange = new EventEmitter<IAggregationProperties>();

  /**
   * sends new option selected
   * @param {IAggregationProperties} option
   */
  selectItem(option: IAggregationProperties) {
    this.selectedChange.next(option);
  }

  /**
   * sets if expanded class should be set
   */
  ngOnChanges() {
    this.expandedClass = this.isExpanded || !this.showSearchInput ? 'dropdown__list-expandable--expanded' : '';
  }
}

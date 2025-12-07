import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';

/**
 * No Results Found Component
 */
@Component({
    selector: 'app-no-results-found',
    templateUrl: './no-results-found.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [NgIf, TranslatePipe],
})
export class NoResultsFoundComponent implements OnChanges {
  /**
   * Query string
   */
  @Input() q: string;

  /**
   * Determines whether query string has additional search criteria
   */
  @Input('hasCriteria') hasAdditionalQueryCriteria = false;

  /**
   * Decodes query string
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.q) {
      this.q = decodeURIComponent(changes.q.currentValue);
    }
  }
}

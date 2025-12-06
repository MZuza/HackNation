import { Component, Input } from '@angular/core';
import { DefaultResultItemComponent } from '../../result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '../../result-list.component';
import { DetailsResultItemComponent } from '../../right-column/details-result-item/details-result-item.component';

/**
 * Search result component
 */
@Component({
    selector: 'app-search-results-view',
    templateUrl: './search-results-view.component.html',
    standalone: true,
    imports: [
        ResultListComponent,
        DefaultResultItemComponent,
        DetailsResultItemComponent,
    ],
})
export class SearchResultsViewComponent {
  /**
   * data to display
   */
  @Input() items: any[];
}

import { Component, Input } from '@angular/core';

import { ResultItemImageComponent } from '@app/shared/result-list/result-item/result-item-image/result-item-image.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

/**
 * Component to show application items item results
 */
@Component({
  selector: 'app-dataset-item-results',
  templateUrl: './dataset-item-results.component.html',
  imports: [
    ResultListComponent,
    ResultItemImageComponent,
    DetailsResultItemComponent
  ],
  standalone: true
})
export class DatasetItemResultsComponent {
    /**
     * items to display
     */
    @Input() items: any;
}

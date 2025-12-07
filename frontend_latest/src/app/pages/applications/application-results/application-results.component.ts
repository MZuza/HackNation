import { Component, Input } from '@angular/core';

import { ResultItemImageComponent } from '@app/shared/result-list/result-item/result-item-image/result-item-image.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

@Component({
    selector: 'app-application-results',
    templateUrl: './application-results.component.html',
    standalone: true,
    imports: [ResultListComponent, ResultItemImageComponent, DetailsResultItemComponent]
})
export class ApplicationResultsComponent {
    /**
     * List of application items to display
     */
    @Input() items: any;
}

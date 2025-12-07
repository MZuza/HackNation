import { Component, Input } from '@angular/core';

import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

/**
 * Component which displays results for providers using list
 */
@Component({
    selector: 'app-institution-results',
    templateUrl: './institution-results.component.html',
    standalone: true,
    imports: [ResultListComponent, DefaultResultItemComponent, DetailsResultItemComponent]
})
export class InstitutionResultsComponent {
    /**
     * data to display
     */
    @Input() items: any[];
}

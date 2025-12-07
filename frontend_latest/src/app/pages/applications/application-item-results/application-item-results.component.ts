import { Component, Input } from '@angular/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

/**
 * Component to show application items item results
 */
@Component({
    selector: 'app-application-item-results',
    templateUrl: './application-item-results.component.html',
    standalone: true,
    imports: [ResultListComponent, DefaultResultItemComponent, DetailsResultItemComponent, LocalizeRouterPipe]
})
export class ApplicationItemResultsComponent {
    /**
     * items to display
     */
    @Input() items: any;
}

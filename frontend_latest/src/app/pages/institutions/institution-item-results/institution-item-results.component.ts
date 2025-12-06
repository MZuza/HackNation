import { Component, Input } from '@angular/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

import { ApiModel } from '@app/services/api/api-model';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

@Component({
    selector: 'app-institution-item-results',
    templateUrl: './institution-item-results.component.html',
    standalone: true,
    imports: [ResultListComponent, DefaultResultItemComponent, DetailsResultItemComponent, LocalizeRouterPipe]
})
export class InstitutionItemResultsComponent {

    /**
     * API model
     */
    apiModel = ApiModel;

    @Input() items: any;
}

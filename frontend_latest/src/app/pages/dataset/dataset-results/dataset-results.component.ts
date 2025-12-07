import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ApiModel } from '@app/services/api/api-model';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';
import { SubscribeButtonComponent } from '@app/shared/subscribe-button/subscribe-button.component';

/**
 * Component to show dataset results
 */
@Component({
    selector: 'app-dataset-results',
    templateUrl: './dataset-results.component.html',
    standalone: true,
    imports: [
        ResultListComponent,
        DefaultResultItemComponent,
        DetailsResultItemComponent,
        NgIf,
        SubscribeButtonComponent,
        TranslatePipe,
    ],
})
export class DatasetResultsComponent {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * items to display
   */
  @Input() items: any;

  /**
   * is user logged in
   */
  @Input() isUserLoggedIn = false;
}

import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { DefaultResultItemComponent } from '../default-result-item/default-result-item.component';

@Component({
    selector: 'app-result-item-image',
    templateUrl: './result-item-image.component.html',
    standalone: true,
    imports: [
        NgIf,
        DefaultResultItemComponent,
        TranslatePipe,
        LocalizeRouterPipe,
    ],
})
export class ResultItemImageComponent {
  /**
   * dataset item to display
   */
  @Input() item: any;

  /**
   * determinate if list is called from /dataset route
   */
  @Input() fromDatasetEndpoint = false;
}

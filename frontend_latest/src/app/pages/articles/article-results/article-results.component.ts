import { Component, Input } from '@angular/core';

import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

@Component({
    selector: 'app-article-results',
    templateUrl: './article-results.component.html',
    standalone: true,
    imports: [ResultListComponent, DefaultResultItemComponent, DetailsResultItemComponent]
})
export class ArticleResultsComponent {
    @Input() items: any;
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';


/**
 * Component which displays followed queries
 */
@Component({
    selector: 'app-follow-query-results',
    templateUrl: './follow-query-results.component.html',
    standalone: true,
    imports: [ResultListComponent, DefaultResultItemComponent, LocalizeRouterPipe, TranslatePipe]
})
export class FollowQueryResultsComponent  {
    /**
     * data to display
     */
    @Input() items: any[];

    /**
     * unfollow event
     */
    @Output() unfollow = new EventEmitter<number>();

    /**
     * action invoked after clicking remove subscription
     * @param {number} index
     */
    onUnfollow(index: number) {
        this.unfollow.emit(index);
    }

}

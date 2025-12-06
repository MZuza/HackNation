import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CollapsibleTextComponent } from '@app/shared/collapsible-text/collapsible-text.component';
import { DateFormatPipe } from '@app/shared/pipes/date-format.pipe';
import { DataProposalListItem } from '@app/user/data-proposal/list/DataProposalListItem';

/**
 * Data Proposal List Item Component
 */
@Component({
    selector: 'app-data-proposal-list-item',
    templateUrl: './data-proposal-list-item.component.html',
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        CollapsibleTextComponent,
        TranslatePipe,
        DateFormatPipe,
    ],
})
export class DataProposalListItemComponent {
  /**
   * List Item
   */
  @Input()
  listItem: DataProposalListItem;
}

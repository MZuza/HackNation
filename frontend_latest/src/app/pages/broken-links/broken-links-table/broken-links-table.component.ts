import { Component } from '@angular/core';

import { DataTableComponent } from '@app/shared/data-table/data-table.component';

@Component({
  selector: 'app-broken-links-table',
  standalone: true,
  imports: [
    DataTableComponent
  ],
  templateUrl: './broken-links-table.component.html',
})
export class BrokenLinksTableComponent {

}

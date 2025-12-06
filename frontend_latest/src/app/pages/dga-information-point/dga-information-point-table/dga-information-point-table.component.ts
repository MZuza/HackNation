import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ResourceTableNoFiltersComponent } from '@app/shared/resource-table-no-filters/resource-table-no-filters.component';

@Component({
  selector: 'app-dga-information-point-table',
  templateUrl: './dga-information-point-table.component.html',
  standalone: true,
  imports: [
    ResourceTableNoFiltersComponent
  ]
})
export class DgaInformationPointTableComponent implements OnInit {

  resourceId: string;
  tableTitle = '';
  pageTitle: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.resourceId = this.route.parent.snapshot.data['post'].resData.resource_id;
  }

}

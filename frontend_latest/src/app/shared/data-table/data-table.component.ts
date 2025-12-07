import { NgClass } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, Input, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';

import { BrokenLinksService } from '@app/services/broken-links.service';
import { ResourceHelper } from '@app/shared/helpers/resource.helper';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { ResourceColumnDataPipe } from '@app/shared/pipes/resource-column-data.pipe';
import { DefaultListViewParams } from '@app/shared/resource-table/DefaultListViewParams';
import { ResourceTableColumn } from '@app/shared/resource-table/ResourceTableColumn';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TranslatePipe,
    ItemsPerPageComponent,
    NgClass,
    RouterLink,
    ResourceColumnDataPipe,
    PaginationComponent,
    MatTooltip
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit {
  // TODO do more generic data fetching when more reports will be meant to display

  private activatedRoute = inject(ActivatedRoute);
  private brokenLinksService = inject(BrokenLinksService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @Input() tableTitle: string;

  @ViewChild('dataTable') dataTableRef: ElementRef;

  basicParams: DefaultListViewParams = {
    page: 1,
    per_page: 20,
    q: '',
    sort: '',
  };
  params = signal<DefaultListViewParams>(this.basicParams);
  hasTableView = true;
  columns: ResourceTableColumn[];
  items: any[];
  count: number;
  countLimit = 10000;
  isTableFullWidth = false;
  hoveredRowIndex = -1;
  focusedCell = -1;

  ngOnInit() {

    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((qParamMap) => {
          const params = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || '',
          };
          this.params.update((value) => ({
            ...value,
            ...params
          }));
          return this.brokenLinksService.getBrokenLinksTableData(params);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        if (!response['meta']['headers_map']) {
          this.hasTableView = false;
          return;
        }
        this.hasTableView = true;

        if (!response['data'].length) {
          this.items = null;
          this.count = this.params() && !!this.params().q ? 0 : null;
          return;
        }
        this.columns = ResourceHelper.getTableColumns(response);
        this.items = response['data'].map(item => item['attributes']);
        this.count = response['meta']['count'];
      });


  }

  updateParams(params: DefaultListViewParams) {
    if (!params.page) {
      params.page = 1;
    }

    this.params.update((value) => {
      return {
        ...value,
        ...params
      };
    });
    this.router.navigate([], { queryParams: this.params(), replaceUrl: true });
  }

  sortByColumn(name: string) {
    const params = { sort: name };

    if (this.params().sort) {
      // the same column
      if (this.params().sort.indexOf(name) !== -1) {
        params.sort = this.params().sort.startsWith('-', 0) ? name : `-${name}`;
      }
    }

    this.updateParams(params);
  }

  onMouseLeave() {
    if (!this.focusedCell) {
      this.hoveredRowIndex = -1;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      return this.hoveredRowIndex - 1 > -1 && (this.hoveredRowIndex -= 1);
    } else if (event.key === 'ArrowDown') {
      return this.hoveredRowIndex + 1 < this.params().per_page && (this.hoveredRowIndex += 1);
    } else if (event.key === 'ArrowRight') {
      return this.focusedCell + 1 < this.columns.length && (this.focusedCell += 1);
    } else if (event.key === 'ArrowLeft') {
      return this.focusedCell - 1 > -1 && (this.focusedCell -= 1);
    } else {
      return this.hoveredRowIndex > -1 && this.focusedCell > -1 && this.setFocus();
    }
  }

  setFocus() {
    const row = this.dataTableRef.nativeElement.querySelectorAll('tbody tr')[this.hoveredRowIndex];
    const cell = row.querySelectorAll('td')[this.focusedCell];

    cell.focus();
  }

  onFocus(rowIndex: number, cellIndex: number) {
    this.hoveredRowIndex = rowIndex;
    this.focusedCell = cellIndex;
  }



  public getUrlAfterNthSlash(url: string, n: number): string {
    const parts = url.split('/');
    return parts.slice(n).join('/');
  }

}

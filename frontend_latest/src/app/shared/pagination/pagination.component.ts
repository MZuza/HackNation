import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Pagination Global component
 * @example
 * <app-pagination
 *   [itemsPerPage]="pagination.per_page"
 *   [totalItems]="pagination.count"
 *   [(page)]="pagination.page"
 *   (numPages)="pagination.numPages = $event"
 *   (pageChange)="updateParams({page: $event})">
 *   </app-pagination>
 */
@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        NgFor,
        NgIf,
        TranslatePipe,
    ],
})
export class PaginationComponent implements OnChanges {
  /**
   * How many pages link to show on each end
   * @type {number}
   */
  @Input() maxRange = 2;

  /**
   * How many items are shown on each page
   * @returns {number}
   */
  @Input() itemsPerPage: number;

  /**
   * How many items are available
   * @returns {number}
   */
  @Input() totalItems: number;

  /**
   * Called each time a page link is clicked
   * @type {EventEmitter<any>}
   */
  @Output() pageChange = new EventEmitter();

  /**
   * Called only once when the number of items is changed, and pages link needs to be recalculated. Returns number of pages.
   * @type {EventEmitter<any>}
   */
  @Output() numPages = new EventEmitter();

  /**
   * Number of all pages.
   */
  totalPages: number;

  /**
   * List of visible page links
   */
  pageNumbersToShow: Array<number>;

  /**
   * @ignore
   */
  private _page: number;

  /**
   * Triggered everytime \@Input values are changed
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.calculateVisiblePages();
  }

  /**
   * What is the current page number
   * @returns {number}
   */
  @Input()
  get page(): number {
    return this._page;
  }

  set page(value: number) {
    if (!value) {
      value = 1;
    }
    this._page = +value;
  }

  /**
   * Event triggered when page number is clicked
   * @param page
   */
  changePage(page: number) {
    if (page < 1) {
      page = 1;
    }
    if (page > this.totalPages) {
      page = this.totalPages;
    }
    this.page = page;
    this.pageChange.emit(this.page);
  }

  /**
   * Calculates number of pages and which pages are shown. Outputs pages count.
   */
  calculateVisiblePages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pageNumbersToShow = [];

    const startPage = Math.max(this.page - this.maxRange, 1);
    const visiblePageCount = Math.min(this.page + this.maxRange, this.totalPages);

    for (let i = startPage; i <= visiblePageCount; i++) {
      this.pageNumbersToShow.push(i);
    }

    if (startPage - 1 >= this.maxRange) {
      this.pageNumbersToShow.unshift(null);
    }
    if (startPage !== 1) {
      this.pageNumbersToShow.unshift(1);
    }
    if (this.totalPages - visiblePageCount >= this.maxRange) {
      this.pageNumbersToShow.push(null);
    }
    if (this.totalPages !== visiblePageCount) {
      this.pageNumbersToShow.push(this.totalPages);
    }

    this.numPages.emit(visiblePageCount);
  }
}

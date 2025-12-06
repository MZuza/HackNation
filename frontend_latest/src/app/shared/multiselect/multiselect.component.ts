import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Custom dropdown component with multi-selection capability
 * @example
 * <app-multiselect [options] [(selected)] [multiselect]="true" placeholder="Example" ></app-multiselect>
 */
@Component({
    selector: 'app-multiselect',
    templateUrl: './multiselect.component.html',
    animations: [toggleVertically],
    standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    NgFor,
    TranslatePipe,
    SanitizeHtmlPipe,
  ],
})
export class MultiselectComponent implements OnInit, OnDestroy {
  /**
   * **Required.** Attribute that stores available options in dropdown
   */
  @Input() options: any[];

  /**
   * **Required.** Value - which item from the list is selected
   */
  @Input() selected: any[] | any;

  /**
   * **Optional.** Enable multiselect? Default value: (true).
   */
  @Input() multiselect: boolean;

  /**
   * **Optional.** Provide if you want to display specific property to be displayed
   * @type {string}
   */
  @Input() displayValue: string = '';

  /**
   * **Optional.** Provide if you want to display text for empty value/label
   */
  @Input() placeholder: string;

  /**
   * **Optional.** Do you want to display quick filter input
   * @type {boolean}
   */
  @Input() showSearchInput = true;

  /**
   * **Optional.** Aria labelledby attribute
   */
  @Input() labelId: string;
  @Output() selectedChange: EventEmitter<any[] | any> = new EventEmitter<any[] | any>();

  @ViewChild('inputFilter', { read: ElementRef }) inputFilter: ElementRef;
  @ViewChild('toggler') toggler: ElementRef;

  isExpanded = false;
  generatedId: string;
  tempSelected: any[] | any;
  filteredOptions: any[];

  private clickOutsideListener: () => void;
  private clickEscapeListener: () => void;

  private _searchText: string;
  public get searchText(): string {
    return this._searchText;
  }

  public set searchText(value: string) {
    this._searchText = value;

    if (this.showSearchInput) {
      this.filteredOptions = this.searchText ? this.performFilter(this.searchText) : [...this.options];
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  /**
   * Create ID and attach events
   */
  ngOnInit() {
    this.generatedId = `dropdown-${StringHelper.generateRandomHex()}`;
    this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
    this.clickEscapeListener = this.renderer.listen('body', 'keydown.esc', (event: KeyboardEvent) => {
      // event.key may vary depending on a browser
      if (event.keyCode === 27) {
        if (this.isExpanded && this.toggler) {
          this.toggler.nativeElement.focus();
          this.isExpanded = false;
        }
      }
    });

    this.filteredOptions = this.options ? [...this.options] : [];
  }

  /**
   * Destory events
   */
  ngOnDestroy() {
    this.clickOutsideListener();
    this.clickEscapeListener();
  }

  /**
   * Click outside event listener. Hides dropdown.
   * @param event
   */
  clickOutside(event) {
    const targetElement = event.target as HTMLElement;
    const parentElement = this.elementRef.nativeElement as HTMLElement;
    const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

    if (!clickedInside) {
      this.isExpanded = false;
    }
  }

  /**
   * Event triggered on selecting item from dropdown
   * @param item
   */
  selectItem(item) {
    if (this.multiselect) {
      if (!this.tempSelected) { this.tempSelected = []; }

      const index = this.tempSelected.indexOf(item);
      index === -1 ? this.tempSelected.push(item) : this.tempSelected.splice(index, 1);
    } else {
      this.tempSelected = this.tempSelected === item ? null : item;
    }
  }

  /**
   * Opens up and closed dropdown. Clears search filter
   */
  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded && this.showSearchInput) {
      (this.searchText = '');
    }

    // renew applied selections
    this.assignTemp();
  }

  /**
   * Template function, checks if item is selected
   * @param item
   * @returns {boolean}
   */
  isItemSelected(item) {
    return this.multiselect ? this.tempSelected.indexOf(item) !== -1 : this.tempSelected === item;
  }

  /**
   * Filters out items by text.
   * @param {string} filterBy
   * @returns {any[]}
   */
  performFilter(filterBy: string) {
    return this.options.filter(item => {
      item = item[this.displayValue] ? item[this.displayValue] : item;
      return item.toLowerCase().indexOf(filterBy.toLowerCase()) !== -1;
    });
  }

  /**
   * Apply button commits selected items to Event emitter, and informs parent view
   */
  applyFilters() {
    if (this.tempSelected || this.selected) {
      if (this.multiselect) {
        this.selected = [...this.tempSelected];
      } else {
        this.selected = this.tempSelected;
      }

      this.selectedChange.emit(this.selected);
      this.isExpanded = !this.isExpanded;
    }

    setTimeout(() => {
      if (this.toggler) {
        this.toggler.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * Clears not applied filters.
   */
  assignTemp() {
    this.multiselect ? (this.tempSelected = [...this.selected]) : (this.tempSelected = this.selected);
  }
}

import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { toggleVertically } from '@app/animations';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { TranslatePipe } from '@ngx-translate/core';
import { ObjectHelper } from '../helpers';

/**
 * A counterpart to multiselect component. Allows to store and select only one element.
 * @example
 * <app-singleselect [options]="[1,2,3,4]" [(selected)]="selected" placeholder="Label"></app-singleselect>
 */
@Component({
    selector: 'app-singleselect',
    templateUrl: './singleselect.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        NgFor,
        TranslatePipe,
    ],
})
export class SingleselectComponent implements OnDestroy, OnChanges {
  /**
   * List of options to choose from
   */
  @Input() options: any[];

  /**
   * Selected option
   */
  @Input() selected: any;

  /**
   * Selected option placeholder
   */
  @Input() placeholder: string;

  /**
   * Determines whether is dropdown or dropup
   */
  @Input() isUp: boolean = false;

  /**
   * Id of related element
   */
  @Input() labelId: string;

  /**
   * Emits selected item
   */
  @Output() selectedChange = new EventEmitter();

  /**
   * Reference to dropdown trigger
   */
  @ViewChild('toggler') toggler: ElementRef;

  /**
   * Determines whether dropdown is expanded
   */
  isExpanded: boolean = false;

  /**
   * Random id - button-dropdown relation
   */
  generatedId = StringHelper.generateRandomHex();

  /**
   * Toggler label
   */
  togglerLabel: string;

  /**
   * Click outside listener
   */
  private clickOutsideListener: () => void;

  /**
   * Click escape listener
   */
  private clickEscapeListener: () => void;

  /**
   * Default index when nothing is selected
   */
  notSelectedIndex = 0;

  /**
   * Active option index
   */
  currentIndex = -1;

  /**
   * Selected option index
   */
  selectedIndex = -1;

  /**
   * @ignore
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
    this.clickEscapeListener = this.renderer.listen('body', 'keydown.esc', (event: KeyboardEvent) => {
      this.isExpanded = false;
    });
  }

  /**
   * On Input changes set displayed label based on whether item is selected or not
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this.options || !this.options.length) {
      return;
    }

    const firstOption = this.options[0];
    const optionsAreObjects = ObjectHelper.isObject(this.options[0]);

    if (changes.selected && !changes.selected.currentValue) {
      this.togglerLabel = this.placeholder || ObjectHelper.isObject(firstOption) ? firstOption.label : firstOption;
      this.selectedIndex = 0;
    } else {
      if (optionsAreObjects) {
        const matchingOption = this.options.find(option => option['value'] === this.selected);
        const matchingOptionIndex = this.options.findIndex(option => option['value'] === this.selected);

        if (matchingOption) {
          this.togglerLabel = matchingOption['label'];
          this.selectedIndex = matchingOptionIndex;
        }
      } else {
        this.togglerLabel = this.selected;
        this.selectedIndex = this.options.findIndex(option => option === this.selected);
      }
    }

    this.currentIndex = this.selectedIndex;
  }

  /**
   * Remove listeners
   */
  ngOnDestroy() {
    this.clickOutsideListener();
    this.clickEscapeListener();
  }

  /**
   * Click outside event handler
   * @param {Event} event
   */
  clickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const parentElement = this.elementRef.nativeElement as HTMLElement;
    const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

    if (!clickedInside) {
      this.isExpanded = false;
    }
  }

  /**
   * Click/Select item event handler
   * @param item
   */
  selectItem(item) {
    this.isExpanded = false;

    if (item === this.selected) {
      return;
    }

    this.selected = item;
    this.selectedChange.emit(this.selected);

    setTimeout(() => {
      (<HTMLInputElement>this.toggler.nativeElement).focus();
    }, 500);
  }

  /**
   * Toggles dropdown
   */
  toggleDropdown() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.currentIndex = this.selectedIndex;
    }
  }

  /**
   * Sets next index on the list as active
   */
  setNextActiveSuggestionIndex() {
    if (this.currentIndex === this.options.length - 1) {
      this.currentIndex = this.notSelectedIndex;
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Sets previous index on the list as active
   */
  setPreviousActiveSuggestionIndex() {
    if (this.currentIndex === this.notSelectedIndex) {
      this.currentIndex = this.options.length - 1;
    } else if (this.currentIndex === 0) {
      this.currentIndex = this.notSelectedIndex;
    } else {
      this.currentIndex--;
    }
  }

  /**
   * Enables keyboard navigation.
   * Performs actions on keyboard events.
   * @param {KeyboardEvent} event
   */
  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.setNextActiveSuggestionIndex();
        event.preventDefault();
        break;

      case 'ArrowUp':
        this.setPreviousActiveSuggestionIndex();
        event.preventDefault();
        break;

      case 'Enter':
        event.preventDefault();

        if (!this.isExpanded) {
          this.isExpanded = true;
        } else {
          this.selectItem(this.options[this.currentIndex]);
        }
        break;

      case 'Tab':
        if (this.isExpanded) {
          this.isExpanded = false;
        }
        break;

      case 'Space':
        if (event.shiftKey) {
          this.isExpanded = true;
          event.preventDefault();
        }
        break;

      case 'Escape':
        this.isExpanded = false;
    }
  }
}

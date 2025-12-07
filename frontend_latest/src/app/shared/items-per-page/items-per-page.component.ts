import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { StringHelper } from '../helpers/string.helper';

import { getEventSelectValue } from '@app/shared/util';

@Component({
    selector: 'app-items-per-page',
    templateUrl: './items-per-page.component.html',
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        NgFor,
        TranslatePipe,
    ],
})
export class ItemsPerPageComponent {
  /**
   * List of options to choose from
   */
  @Input() options = [5, 10, 20, 50];

  /**
   * Selected option
   */
  @Input() selected: number;

  /**
   * Emits selected item
   */
  @Output() selectedChange = new EventEmitter();

  /**
   * Determines whether number exists in array of options
   */
  isNumberValid: boolean;

  /**
   * Unique id
   */
  uniqueId = StringHelper.generateRandomHex();

  protected readonly getSelectValue = getEventSelectValue;
  protected readonly Number = Number;

  /**
   * Emits value on change
   * @param {number} value
   */
  onChange(value: number) {
    this.selectedChange.emit(value);
  }

  /**
   * Determines whether provided sort value exists on the list of sort options.
   * Filters out counters with '0' value
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.selected = Number(this.selected);
    if (changes.selected) {
      this.isNumberValid = !!this.options.find(option => option === Number(changes.selected.currentValue));
    }
  }
}

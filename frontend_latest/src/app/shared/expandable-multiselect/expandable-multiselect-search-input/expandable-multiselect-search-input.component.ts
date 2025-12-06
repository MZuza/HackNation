import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Search input for list view filter
 */
@Component({
    selector: 'app-expandable-multiselect-input',
    templateUrl: './expandable-multiselect-search-input.component.html',
    standalone: true,
    imports: [TranslatePipe],
})
export class ExpandableMultiselectSearchInputComponent {
  /**
   * placeholder to translate
   */
  @Input() placeholderTranslationKey: string = null;

  /**
   * max length for input
   */
  @Input() maxLength: number = null;

  /**
   * emits when input value changes
   */
  @Output() inputChanged = new EventEmitter<string>();

  onSearchChanged(event: any) {
    this.inputChanged.next(event.target.value);
  }
}

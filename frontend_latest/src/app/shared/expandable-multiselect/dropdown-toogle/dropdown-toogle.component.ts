import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dropdown for expanding options for filter
 */
@Component({
    selector: 'app-dropdown-toogle',
    templateUrl: './dropdown-toogle.component.html',
    standalone: true,
    imports: [NgIf, TranslatePipe]
})
export class DropdownToogleComponent {
    /**
     * expand/hide options
     */
    @Input() isExpanded = false;

    /**
     * Screen reader text
     */
    @Input() srTranslationKey: string;

    /**
     * emits event when options expands/hides
     */
    @Output() toogleChange = new EventEmitter();

    /**
     * sends toggle change when options hide/expand
     */
    expandOptionsList() {
        this.toogleChange.next(true);
    }
}

import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DropdownToogleComponent } from '../../expandable-multiselect/dropdown-toogle/dropdown-toogle.component';

import { toggleVertically } from '@app/animations';

/**
 * Component which shows actions for List View filter
 */
@Component({
    selector: 'app-list-view-filters-action-buttons',
    templateUrl: './list-view-filters-action-buttons.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [NgIf, DropdownToogleComponent, TranslatePipe]
})
export class ListViewFiltersActionButtonsComponent {
    /**
     * flag to show 'Show' element
     */
    @Input() displayShowMore: boolean;
    /**
     * flag to indicate if list is expanded
     */
    @Input() isExpanded: boolean;
    /**
     * flag to enable 'Apply' element
     */
    @Input() enableApply: boolean;
    /**
     * number of selected options
     */
    @Input() selectedCount: number;

    /**
     * Screen reader text
     */
    @Input() srTranslationKey: string;

    /**
     * trigger for click on 'Apply' element
     */
    @Output() triggerApplyChange = new EventEmitter<void>();
    /**
     * trigget for expanding option list
     */
    @Output() expandOptions = new EventEmitter<void>();

    /**
     * triggers expandOptions event
     */
    expandOptionList() {
        this.expandOptions.emit();
    }

    /**
     * triggers applyChanges event
     */
    triggerApply() {
        this.triggerApplyChange.emit();
    }
}

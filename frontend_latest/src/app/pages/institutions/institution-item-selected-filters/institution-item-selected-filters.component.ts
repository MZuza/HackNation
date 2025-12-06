import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { toggle } from '@app/animations';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';
import { SelectedFiltersComponent } from '@app/shared/filters/list-view-selected-filters/selected-filters.component';

/**
 * Institution item selected filter wrapper for all selected filters
 */
@Component({
    selector: 'app-institution-item-selected-filters',
    templateUrl: './institution-item-selected-filters.component.html',
    animations: [toggle],
    standalone: true,
    imports: [
        NgIf,
        SelectedFiltersComponent,
        TranslatePipe,
    ],
})
export class InstitutionItemSelectedFiltersComponent extends ListViewSelectedFiltersAbstractComponent {}

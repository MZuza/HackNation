import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { toggle } from '@app/animations';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';
import { SelectedFiltersComponent } from '@app/shared/filters/list-view-selected-filters/selected-filters.component';

/**
 * Institution selected filter wrapper for all selected filters
 */
@Component({
    selector: 'app-institution-selected-filters',
    templateUrl: './institution-selected-filters.component.html',
    animations: [toggle],
    standalone: true,
    imports: [NgIf, SelectedFiltersComponent, TranslatePipe]
})
export class InstitutionSelectedFiltersComponent extends ListViewSelectedFiltersAbstractComponent {
}

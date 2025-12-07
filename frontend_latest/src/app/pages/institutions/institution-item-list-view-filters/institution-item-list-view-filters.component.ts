import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { InstitutionItemListViewFilterNames } from '@app/services/models/page-filters/institution-item-filters';
import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Institution item filter wrapper for all components
 */
@Component({
    selector: 'app-institution-item-list-view-filters',
    templateUrl: './institution-item-list-view-filters.component.html',
    standalone: true,
    imports: [InfoTooltipDirective, ExpandableMultiselectComponent, DateRangePickerComponent, TranslatePipe]
})
export class InstitutionItemListViewFiltersComponent extends ListViewFilterAbstractComponent {

    /**
     * invokes applyFilter from extended component with institution item filter names
     */
    applyFilter() {
        super.applyFilter(InstitutionItemListViewFilterNames);
    }
}

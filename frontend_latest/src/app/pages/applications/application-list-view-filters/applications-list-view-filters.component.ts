import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ApplicationsListViewFilterNames } from '@app/services/models/page-filters/applications-filters';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';

/**
 * Applications filter wrapper for all components
 */
@Component({
    selector: 'app-applications-list-view-filters',
    templateUrl: './applications-list-view-filters.component.html',
    standalone: true,
    imports: [ExpandableMultiselectComponent, TranslatePipe],
})
export class ApplicationsListViewFiltersComponent extends ListViewFilterAbstractComponent {
    /**
     * set filter name for automatic test
     */
    @Input() filterName: string;

    /**
     * invokes applyFilter from extended component with applications filter names
     */
    applyFilter() {
        super.applyFilter(ApplicationsListViewFilterNames);
    }
}

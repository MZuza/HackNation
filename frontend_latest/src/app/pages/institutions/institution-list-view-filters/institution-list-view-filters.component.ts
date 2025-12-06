import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { InstitutionListViewFilterNames } from '@app/services/models/page-filters/institution-filters';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Institution filter wrapper for all components
 */
@Component({
    selector: 'app-institution-list-view-filters',
    templateUrl: './institution-list-view-filters.component.html',
    standalone: true,
    imports: [
        InfoTooltipDirective,
        ExpandableMultiselectComponent,
        TranslatePipe,
    ],
})
export class InstitutionListViewFiltersComponent extends ListViewFilterAbstractComponent {
  /**
   * invokes applyFilter from extended component with institution filter names
   */

  institutionsSortingOrder: string[] = [
    'state',
    'local',
    'private',
    'developer',
    'other',
  ];
  applyFilter() {
    super.applyFilter(InstitutionListViewFilterNames);
  }
}

import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ApiModel } from '@app/services/api/api-model';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { IAggregationPropertiesForRegions } from '@app/services/models/filters';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { SearchSuggestRegionListboxOption } from '@app/shared/search-suggest/search-suggest';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

@Component({
    selector: 'app-regions-search',
    templateUrl: './regions-search.component.html',
    standalone: true,
    imports: [
        SearchSuggestComponent,
        NgIf,
        TranslatePipe,
    ],
})
export class RegionsSearchComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  qPar: Params;

  regionId: number;

  noResults: boolean;

  /**
   * placeholder for search input
   */
  @Input() placeholderTranslationKey = 'Action.EnterRegion';

  /**
   * initial value for region input (after refresh if exists)
   */
  @Input() initialValue: string;

  @Output() enableApply = new EventEmitter<boolean>();

  @Output() selectedChange = new EventEmitter<IAggregationPropertiesForRegions>();

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      const sort = 'relevance';
      this.qPar = qParams;

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };
    });
  }

  getAllFilters(listboxOption: SearchSuggestRegionListboxOption) {
    if (listboxOption) {
      this.noResults = false;
      this.regionId = listboxOption.region_id;
      this.enableApply.emit(true);
      this.selectedChange.next(listboxOption);
    } else {
      this.noResults = true;
      this.selectedChange.next(null);
      this.enableApply.emit(false);
    }
  }

  protected getData() {}

  protected getFiltersModel() {}

  protected getSelectedFiltersCount() {}
}

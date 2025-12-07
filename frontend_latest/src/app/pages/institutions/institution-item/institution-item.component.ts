import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InstitutionItemListViewFiltersComponent } from '../institution-item-list-view-filters/institution-item-list-view-filters.component';
import { InstitutionItemResultsComponent } from '../institution-item-results/institution-item-results.component';
import { InstitutionItemSelectedFiltersComponent } from '../institution-item-selected-filters/institution-item-selected-filters.component';

import { toggle, toggleVertically } from '@app/animations';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { IInstitution } from '@app/services/models/institution';
import {
  IListViewInstitutionItemCategoryFiltersModel,
  IListViewInstitutionItemFiltersModel,
} from '@app/services/models/page-filters/institution-item-filters';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { ApiSourceLinkComponent } from '@app/shared/api-source-link/api-source-link.component';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { FoundResultsCountersAndSortComponent } from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { TemplateHelper } from '@app/shared/helpers';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';
import { WriteUsInfoComponent } from '@app/shared/write-us-info/write-us-info.component';

/**
 * Institution Item Component
 */
@Component({
    selector: 'app-institution-item',
    templateUrl: './institution-item.component.html',
    animations: [toggle, toggleVertically],
    standalone: true,
  imports: [
    NgIf,
    CdkCopyToClipboard,
    TooltipDirective,
    NgClass,
    SearchSuggestComponent,
    InstitutionItemListViewFiltersComponent,
    InstitutionItemSelectedFiltersComponent,
    FoundResultsCountersAndSortComponent,
    NoResultsFoundComponent,
    NotificationsServerComponent,
    InstitutionItemResultsComponent,
    ItemsPerPageComponent,
    PaginationComponent,
    ApiSourceLinkComponent,
    WriteUsInfoComponent,
    AsyncPipe,
    TranslatePipe,
    TranslateDateFormatPipe,
    SanitizeHtmlPipe,
  ],
})
export class InstitutionItemComponent extends ListViewFilterPageAbstractComponent implements OnInit, OnDestroy {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * All date filter fields in institution item page
   */
  readonly DateFields = [AggregationFilterNames.DATE_FROM, AggregationFilterNames.DATE_TO];

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets;

  /**
   * Link to API
   */
  selfApi: string;

  /**
   * Institution  of institution item component
   */
  institution: IInstitution;

  /**
   * Boolean for tooltip at copy button
   */
  clipboardClicked = false;

  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<boolean> = new Subject();

  /**
   * @ignore
   */
  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private institutionsService: InstitutionsService,
    private seoService: SeoService,
    protected selectedFiltersService: ListViewSelectedFilterService,
    private listViewDetailsService: ListViewDetailsService,
    private searchService: SearchService,
    private highContrastService: HighContrastService
  ) {
    super(filterService, activatedRoute, selectedFiltersService);
    this.Facets = [
      AggregationOptionType.CATEGORIES,
      AggregationOptionType.INSTITUTION,
      AggregationOptionType.FORMAT,
      AggregationOptionType.OPENNESS_SCORE,
      AggregationOptionType.VISUALIZATION_TYPE,
      AggregationOptionType.TYPES,
      AggregationOptionType.LICENSES,
      AggregationOptionType.HIGH_VALUE_DATA,
      AggregationOptionType.HIGH_VALUE_DATA_FROM_EC,
      AggregationOptionType.DYNAMIC_DATA,
      AggregationOptionType.UPDATE_FREQUENCY,
      AggregationOptionType.RESEARCH_DATA,
      AggregationOptionType.PROTECTED_DATA
    ];
  }

  /**
   * Sets META tags (title, description).
   * Initializes institution detail.
   * Initializes default filters.
   * Initializes and updates list of items (related datasets) on query params change.
   */
  ngOnInit() {
    this.institution = this.activatedRoute.snapshot.data['post'];
    this.institution.count = this.institution.relationships ? this.institution.relationships.datasets.meta.count : 0;
    this.seoService.setPageTitle(this.institution.attributes.title);
    this.seoService.setDescriptionFromText(this.institution.attributes.description);
    this.highContrastService.getCurrentContrastMode()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(mode => this.highContrastMode = mode);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };

    const customParams = [
      { key: 'institution[id][terms]', value: +this.institution.id },
      { key: 'model[terms]', value: 'dataset,resource' },
    ];

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? '' : '-date';
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = 'dataset,resource';
      }

      this.params['institution[id][terms]'] = +this.institution.id;

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService
        .getFilters(ApiConfig.search, this.Facets, customParams)
        .subscribe((allFilters: IListViewFilterAggregationsOptions) => {
          this.filters = allFilters;
          this.setSelectedFilters(this.params);
        });

      this.getData();
    });
  }

  /**
   * Gets list of related datasets
   */
  protected getData() {
    this.searchService.getData(TemplateHelper.parseUrl(ApiConfig.search, { id: this.institution.id }), this.params).subscribe(data => {
      this.counters = data.aggregations.counters;
      this.items = this.listViewDetailsService.extendViewDetails(data.results);
      this.count = data.count;
      this.selfApi = data.links.self;
    });
  }

  /**
   * returns new empty data model for filters
   * @returns {IListViewInstitutionItemFiltersModel}
   */
  protected getFiltersModel(): IListViewInstitutionItemFiltersModel | IListViewInstitutionItemCategoryFiltersModel {
    // @ts-ignore
    return {
      [AggregationFilterNames.CATEGORIES]: {},
      [AggregationFilterNames.FORMAT]: {},
      [AggregationFilterNames.OPENNESS_SCORE]: {},
      [AggregationFilterNames.VISUALIZATION_TYPE]: {},
      [AggregationFilterNames.TYPES]: {},
      [AggregationFilterNames.LICENSES]: {},
      [AggregationFilterNames.UPDATE_FREQUENCY]: {},
      [AggregationFilterNames.HIGH_VALUE_DATA]: {},
      [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: {},
      [AggregationFilterNames.DYNAMIC_DATA]: {},
      [AggregationFilterNames.DATE_FROM]: null,
      [AggregationFilterNames.DATE_TO]: null,
      [AggregationFilterNames.RESEARCH_DATA]: {},
      [AggregationFilterNames.PROTECTED_DATA]: {}
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return (
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.CATEGORIES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.FORMAT]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.OPENNESS_SCORE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.VISUALIZATION_TYPE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.TYPES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.LICENSES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.UPDATE_FREQUENCY]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.HIGH_VALUE_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.DYNAMIC_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.RESEARCH_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.PROTECTED_DATA]) +
      (this.backupSelectedFilters[AggregationFilterNames.DATE_FROM] || this.backupSelectedFilters[AggregationFilterNames.DATE_TO] ? 1 : 0)
    );
  }

  clickOnClipboard() {
    this.clipboardClicked = true;
    setTimeout(() => {
      this.clipboardClicked = false;
      }, 4000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}

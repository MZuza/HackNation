import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, QueryParamsHandling, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';

import { ApiModel } from '@app/services/api/api-model';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { ISearchCounters, ISearchResponse } from '@app/services/models/search';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import {
  FoundResultsCountersAndSortComponent
} from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchResultsViewComponent } from '@app/shared/result-list/results/search-results-view/search-results-view.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  imports: [
    TranslatePipe,
    SearchSuggestComponent,
    NotificationsServerComponent,
    FoundResultsCountersAndSortComponent,
    NgIf,
    LoaderComponent,
    SearchResultsViewComponent,
    NoResultsFoundComponent,
    ItemsPerPageComponent,
    PaginationComponent
  ],
  standalone: true
})
export class SearchResultsComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Count of items (any type)
   */
  totalCount: number;

  /**
   * Counters of items by type
   */
  counters: ISearchCounters;

  /**
   * Search results
   */
  results: any[];

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Basic params of institutions component
   */
  basicParams = {
    sort: 'relevance',
    page: 1,
    q: '',
    per_page: 20,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private searchService: SearchService,
    private notificationsService: NotificationsService,
    private listViewDetailsService: ListViewDetailsService,
    private localizeRouterService: LocalizeRouterService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes and updates list of items on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Search.Results']);

    this.basicParams = { ...this.basicParams, ...this.activatedRoute.snapshot.queryParams };

    this.searchService.search(this.basicParams).subscribe(resp => this.setCounterAndResults(resp));

    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((qParamMap: ParamMap) => {
          this.basicParams = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || this.basicParams['sort'],
          };
          return this.searchService.search(this.basicParams);
        }),
      )
      .subscribe(
        (resp: ISearchResponse) => this.setCounterAndResults(resp),
        error => {
          if (error.message) {
            this.notificationsService.addError(error.message);
          }
        },
      );
  }

  /**
   * Updates query params on every user interaction
   * @param resp {ISearchResponse}
   */
  setCounterAndResults(resp: ISearchResponse) {
    this.counters = resp.meta.aggregations.counters;
    this.totalCount = resp.meta.count;
    this.results = this.listViewDetailsService
      .extendViewDetails(resp.data)
      .filter(data => data.attributes.model !== 'application' && data.attributes.model !== 'article');
  }

  /**
   * Updates query params on user interaction
   * @param {Params} params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: Params, method: QueryParamsHandling | null = 'merge') {
    if (!('page' in params)) {
      params['page'] = 1;
    }
    this.basicParams = { ...this.basicParams, ...params };
    this.router.navigate(this.localizeRouterService.translateRoute(['/!search']) as [], {
      queryParams: this.basicParams,
      queryParamsHandling: method,
    });
  }
}

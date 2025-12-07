import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, QueryParamsHandling, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ArticleResultsComponent } from '../article-results/article-results.component';

import { APP_CONFIG } from '@app/app.config';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { INewsPageParams } from '@app/services/models/page-params';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { FoundResultsCountersAndSortComponent } from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

/**
 * Article Component
 */
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    standalone: true,
    imports: [
        SearchSuggestComponent,
        NgIf,
        FoundResultsCountersAndSortComponent,
        NotificationsServerComponent,
        NoResultsFoundComponent,
        ArticleResultsComponent,
        ItemsPerPageComponent,
        PaginationComponent,
        TranslatePipe,
    ],
})
export class ArticleComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Items (articles from one category - news)
   */
  items: any[];

  /**
   * Count  of items (articles)
   */
  count: number;

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Page setting based on basic params and user interactions
   */
  params: INewsPageParams;

  /**
   * Basic params of article component
   */
  basicParams: INewsPageParams = {
    sort: '-date',
    page: 1,
    q: '',
    per_page: 5,
  };

  /**
   * Max length of search input
   */
  maxLength = APP_CONFIG.searchInputMaxLength;

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private searchService: SearchService,
    private filterService: ListViewFiltersService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes and updates list of items (articles) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Articles.News']);

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';
      if (!this.allBasicParamsIn(qParams)) {
        sort = qParams['q'] ? 'relevance' : this.basicParams['sort'];
      }
      this.params = {
        ...qParams,
        ...this.filterService.updateBasicParams(qParams, this.basicParams, sort),
      };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = ApiModel.NEWS;
      }
      this.params = {
        ...this.params,
        ...{
          children_per_page: +qParams['per_page'] || this.basicParams['per_page'],
          children_page: +qParams['page'] || this.basicParams['page'],
          children_extra_fields: 'body,author,tags',
        },
      };

      this.getData();
    });
  }

  /**
   * Updates query params on every user interaction
   * @param params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: any, search: boolean | null = false, method: QueryParamsHandling | null = 'merge') {
    // empty search
    if (!('sort' in params) && params['sort'] && 'q' in params && !(<string>params['q']).trim().length) {
      return;
    } else if ('sort' in params && !params['sort']) {
      // default sort
      params['sort'] = this.basicParams['sort'];
    }

    let updatedBasicParams;

    if (search) {
      updatedBasicParams = {
        page: +this.params['page'] || this.basicParams['page'],
        per_page: +this.params['per_page'] || this.basicParams['per_page'],
        q: this.params['q'] || '',
        sort: this.params['sort'] || '',
      };
    } else {
      updatedBasicParams = {
        children_page: +this.params['page'] || this.basicParams['page'],
        children_per_page: +this.params['per_page'] || this.basicParams['per_page'],
        q: this.params['q'] || '',
        sort: this.params['sort'] || '',
      };
    }

    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...params,
      },
      queryParamsHandling: method,
    });
  }

  /**
   * Checks whether default page params already exist
   * @param {Params} params
   * @returns {boolean}
   */
  private allBasicParamsIn(params: Params): boolean {
    return this.filterService.allBasicParamsIn(params, this.basicParams);
  }

  /**
   * Gets list of articles
   */
  private getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(resp => {
      this.items = resp.results;
      this.count = resp.count;
    });
  }

}

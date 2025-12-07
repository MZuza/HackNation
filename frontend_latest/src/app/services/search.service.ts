import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { ApiConfig, ApiResponse } from '@app/services/api';
import { ApiParametersConfig } from '@app/services/api/api-parameters';
import { SearchHttpParamEncoder } from '@app/services/http/SearchHttpParamEncoder';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { LoginService } from '@app/services/login-service';
import { IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { PageParams } from '@app/services/models/page-params';
import { NotificationsService } from '@app/services/notifications.service';
import { RestService } from '@app/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends RestService {
  constructor(
    private filterService: ListViewFiltersService,
    protected http: HttpClient,
    public translate: TranslateService,
    public router: Router,
    public notificationService: NotificationsService,
    public storageService: LocalStorageService,
    public cookieService: CookieService,
    public loginService: LoginService,
    @Inject(DOCUMENT) public document: any,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    super(http, translate, router, notificationService, storageService, cookieService, loginService, document, platformId);
  }

  /**
   * Search query through all data: datasets, providers, applications, etc.
   * @param {any} params
   * @returns { Observable<any>}
   */
  search(params: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: params, encoder: new SearchHttpParamEncoder() });
    return this.get(ApiConfig.search, httpParams);
  }

  /**
   * Get search data
   * @param {string} url
   * @param {PageParams} params
   * @returns {Observable<ApiResponse>}
   */
  getData(url: string, params: PageParams): Observable<ApiResponse> {
    const httpParams = new HttpParams({ fromObject: params, encoder: new SearchHttpParamEncoder() });

    return this.get(url, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
      publishReplay(1),
      refCount(),
    );
  }

  /**
   * Get list of available filter values from facets
   * @param {string} url
   * @param {string []} facets
   * @param {{ key: string, value: any }[]} customParams
   * @returns {Observable<IListViewFilterAggregationsOptions>}
   */
  getFilters(url: string, facets: string[], customParams?: { key: string; value: any }[]): Observable<IListViewFilterAggregationsOptions> {
    let httpParams = new HttpParams();
    if (customParams) {
      customParams.forEach(param => {
        httpParams = httpParams.append(param.key, param.value);
      });
    }
    httpParams = httpParams.append('per_page', '1');
    httpParams = httpParams.append(ApiParametersConfig.FACET_WITH_TERMS, facets.join(','));

    return this.get(url, httpParams).pipe(
      map(response => {
        const filters = response['meta']['aggregations'];
        return this.filterService.prepareFilters(filters);
      }),
      publishReplay(1),
      refCount(),
    );
  }
}

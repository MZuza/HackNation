import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, ReplaySubject, share } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { ApiConfig, ApiResponse } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { SearchHttpParamEncoder } from '@app/services/http/SearchHttpParamEncoder';
import { LoginService } from '@app/services/login-service';
import { HttpCustomErrorResponse } from '@app/services/models';
import { IChartBlueprint } from '@app/services/models/chart';
import { AggregationFilterNames } from '@app/services/models/filters';
import { IMapFilterParams } from '@app/services/models/map';
import { PageParams } from '@app/services/models/page-params';
import { NotificationsService } from '@app/services/notifications.service';
import { RestService } from '@app/services/rest.service';
import { TemplateHelper } from '@app/shared/helpers';

/**
 *  Dataset services that handles communication with Dataset API `\/datasets`
 */
@Injectable()
export class DatasetService extends RestService {

  apiModel = ApiModel;
  /**
   * Determines whether a new resource filter was generated
   */
  resourceFilterChanged = new BehaviorSubject<string>('');

  /**
   * Notifies when a new resource filter was generated
   */
  readonly resourceFilterChanged$ = this.resourceFilterChanged.asObservable();

  /**
   * @ignore
   */
  constructor(
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
   * Get list of dataset items from given filters in `params` variable
   * @param {PageParams} params
   * @returns {Observable<ApiResponse>}
   */
  getAll(params: PageParams): Observable<ApiResponse> {
    const httpParams = new HttpParams({ fromObject: params });

    return this.get(ApiConfig.search, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
      share({
        connector: () => new ReplaySubject(1),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false
      })
    );
  }

  /**
   * Get one dataset item from a given id
   * @param {string} id
   * @returns {Observable<any>}
   */
  getOneById(id: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('include', ApiModel.INSTITUTION);

    return this.get(ApiConfig.datasets + '/' + id, httpParams);
  }

  /**
   * Get changes history for a given dataset id with page number and number of items per page
   * @param {string} id
   * @param {number} page
   * @param {number} per_page
   * @returns {any}
   */
  getHistoryById(id: string, page: number = 1, per_page: number = 10) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('table_name', ApiModel.DATASET);
    httpParams = httpParams.append('row_id', id);
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('sort', '-change_timestamp');
    httpParams = httpParams.append('per_page', per_page.toString());

    return this.get(ApiConfig.history, httpParams).pipe(publishReplay(1), refCount());
  }

  /**
   * Get list of resources for given dataset id
   * @param {string} id
   * @param params
   * @returns {Observable<ApiResponse>}
   */
  getResourcesList(id: string, params: any = {}): Observable<ApiResponse> {
    const url = TemplateHelper.parseUrl(ApiConfig.resources, { id: id });

    return this.get(url, params).pipe(map(response => new ApiResponse(response)));
  }

  /**
   * Get specific resource for given id
   * @param {string} resourceId
   * @returns {Observable<any>}
   */
  getResourceById(resourceId: string) {
    const url = TemplateHelper.parseUrl(ApiConfig.resourceDetails, { resourceId: resourceId });

    return this.get(url).pipe(map(data => data['data']));
  }

  /**
   *
   * @param {string} resourceId
   * @param {any} params
   */
  getResourceData(resourceId: string, params: any) {
    const url = TemplateHelper.parseUrl(ApiConfig.resourceData, { resourceId: resourceId });
    const httpParams = new HttpParams({ fromObject: params, encoder: new SearchHttpParamEncoder() });

    return this.get(url, httpParams);
  }

  /**
   * Send feedback message to dataset owner
   * @param {string} id
   * @param {string} feedback
   * @returns {Observable<any>}
   */
  sendDatasetFeedback(id: string, feedback: string) {
    const url = TemplateHelper.parseUrl(ApiConfig.datasetFeedback, { id: id });
    return this.post(url, feedback);
  }

  getDatasetsStats(datasetId: string, datasetSlug: string) {
    const url = ApiConfig.datasets + '/' + `${datasetId},${datasetSlug}`;
    const params = {
      include: this.apiModel.INSTITUTION
    };

    return this.get(url, params);
  }

  /**
   * Send feedback message to dataset owner
   * @param {string} id
   * @param {string} feedback
   * @returns {Observable<any>}
   */
  sendResourceFeedback(id: string, feedback: string) {
    const url = TemplateHelper.parseUrl(ApiConfig.resourceFeedback, { resourceId: id });
    return this.post(url, feedback);
  }

  /**
   * Sends dataset submission
   * @param {string} submission
   * @returns {Observable<any>}
   */
  sendSubmission(submission: string) {
    return this.post(ApiConfig.submissions, submission);
  }

  /**
   * Gets submissions
   * @param {PageParams} params
   * @returns {Observable<ApiResponse>}
   */
  getSubmissions(params: PageParams): Observable<ApiResponse> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.get(`${ApiConfig.acceptedPublicSubmissions}`, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
      publishReplay(1),
      refCount(),
    );
  }

  /**
   * Gets submission by id
   * @param {string} id
   * @returns {: Observable<any>}
   */
  getSubmission(id: string): Observable<any> {
    return this.get(`${ApiConfig.acceptedPublicSubmissions}/${+id}`);
  }

  /**
   * Sends submission feedback
   * @param {string} id
   * @param {string} feedback
   * @returns {Observable<any>}
   */
  sendSubmissionFeedback(id: string, feedback: string): Observable<any> {
    const url = TemplateHelper.parseUrl(ApiConfig.acceptedPublicSubmissionComment, { id: id });
    return this.post(url, feedback);
  }

  /**
   * Get geo data of resource with given id and parameters
   * @param {string} id
   * @param {IMapFilterParams} filters
   * @returns {Observable<any>}
   */
  getGeoData(id: string, filters?: IMapFilterParams) {
    const url = TemplateHelper.parseUrl(ApiConfig.resourceGeoData, { resourceId: id });
    let httpParams = new HttpParams();

    if (filters && filters.noData) {
      httpParams = httpParams.append('no_data', filters.noData);
    }
    if (filters && filters.boundaryBox) {
      httpParams = httpParams.append('bbox', filters.boundaryBox);
    }
    if (filters && filters.shapesCount) {
      httpParams = httpParams.append('per_page', filters.shapesCount);
    }
    if (filters && filters.distance && filters.coordinates) {
      httpParams = httpParams.append('dist', `${filters.coordinates[1]},${filters.coordinates[0]},${filters.distance}`);
    }
    if (filters && filters.q) {
      httpParams = httpParams.append('q', filters.q);
    }
    return this.get(url, httpParams);
  }

  /**
   * Gets chart related to the resource
   * @param {string} resourceId
   * @returns {Observable<any>}
   */
  getResourceChartById(resourceId: string) {
    const url = TemplateHelper.parseUrl(ApiConfig.resourceCharts, { resourceId: resourceId });
    return this.get(url);
  }

  /**
   * Updates resource chart
   * @param {string} resourceId
   * @param {string} chartId
   * @param {iChartBlueprint} chart
   * @param {boolean} [isDefault]
   * @param {boolean} [isNamedChart]
   * @returns {Observable<any>}
   */
  updateResourceChart(
    resourceId: string,
    chartId: string,
    chart: IChartBlueprint,
    isDefault = false,
    isNamedChart = true,
  ): Observable<any> {
    let name = '';
    if (chart.name) {
      name = `"name": ${JSON.stringify(chart.name)},`;
      delete chart.name;
    }

    const payload = `{
            "data": {
                "type": "chart",
                "attributes": {
                    ${name}
                    "is_default": ${isDefault},
                    "chart": ${JSON.stringify(chart)}
                }
            }
        }`;

    resourceId = resourceId.split(',')[0];
    return this.patch(
      TemplateHelper.parseUrl(ApiConfig.resourceChartsUpdate, { resourceId: resourceId, chartId: chartId }),
      JSON.parse(payload),
    );
  }

  /**
   * Saves chart related to the resource
   * @param {string} resourceId
   * @param {IChartBlueprint} chart
   * @param {boolean} isDefault
   * @returns {Observable<any>}
   */
  saveResourceChart(resourceId: string, chart: IChartBlueprint, isDefault: boolean = false, isNamedChart = true) {
    let name = '';
    if (chart.name) {
      name = `"name": ${JSON.stringify(chart.name)},`;
      delete chart.name;
    }

    const payload = `{
            "data": {
                "type": "chart",
                "attributes": {
                    ${name}
                    "is_default": ${isDefault},
                    "chart": ${JSON.stringify(chart)}
                }
            }
        }`;

    if (isNamedChart) {
      resourceId = resourceId.split(',')[0];
      return this.post(TemplateHelper.parseUrl(ApiConfig.resourceCharts, { resourceId: resourceId }), JSON.parse(payload));
    }

    return this.post(TemplateHelper.parseUrl(ApiConfig.resourceChart, { resourceId: resourceId }), JSON.parse(payload));
  }

  /**
   * Removes chart related to the resource
   * @param {string} chartId
   * @returns {Observable<any>}
   */
  deleteResourceChart(chartId: string) {
    return this.delete(TemplateHelper.parseUrl(ApiConfig.resourceChartDelete, { chartId: chartId }));
  }

  /**
   * checks if query form has error
   * @param {HttpCustomErrorResponse} err
   */
  isQueryError(err: HttpCustomErrorResponse): boolean {
    return !!this.getBackendErrors(err);
  }

  /**
   * Get list of showcases for given dataset id
   * @param {string} id
   * @param params
   * @returns {Observable<ApiResponse>}
   */
  getShowcasesList(id: string, params: any = {}): Observable<ApiResponse> {
    const url = TemplateHelper.parseUrl(ApiConfig.datasetsShowcases, { id: id });
    return this.get(url, params).pipe(map(response => new ApiResponse(response)));
  }

  /**
   * Get list of dataset for boundary box
   * @param {string} mapBoundsString
   * @param {string} sortOption
   * @returns {Observable<any>}
   */
  getDataFromBBox(mapBoundsString: string, sortOption: string, paramQ: string, filters?): Observable<any> {
    let filterNameWithSuffix: string;
    let id: number;
    const param: any = {
      'regions[bbox][geo_shape]': mapBoundsString,
      sort: sortOption ? sortOption : '-date',
      q: paramQ ? paramQ : '',
    };

    if (filters) {
      let name: string;
      filters.forEach(filter => {
        name = filter[0];
        id = filter[1][Object.keys(filter[1])[0]].id;

        switch (name) {
          case AggregationFilterNames.CATEGORIES:
          case AggregationFilterNames.INSTITUTION:
          case AggregationFilterNames.REGIONS:
            filterNameWithSuffix = name + '[id][terms]';
            break;
          case AggregationFilterNames.HIGH_VALUE_DATA:
          case AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC:
          case AggregationFilterNames.DYNAMIC_DATA:
          case AggregationFilterNames.RESEARCH_DATA:
          case AggregationFilterNames.PROTECTED_DATA:
            filterNameWithSuffix = name + '[term]';
            break;
          default:
            filterNameWithSuffix = name + '[terms]';
            break;
        }
        param[filterNameWithSuffix] = id;
      });
    }

    return this.get(ApiConfig.search, param);
  }
}

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { ApiConfig, ApiResponse } from '@app/services/api';
import { IHasImageThumbParams } from '@app/services/models/page-params';
import { RestService } from '@app/services/rest.service';
import { TemplateHelper } from '@app/shared/helpers';

/**
 * Application service handles backend connectivity for `\/applications` page
 */
@Injectable()
export class ApplicationsService extends RestService {
  /**
   * Get applications list from given filters in `params` variable
   * @param {IHasImageThumbParams} params
   * @param {key: string, value: string} additionalParameter
   * @returns {Observable<ApiResponse>}
   */
  getAll(params: IHasImageThumbParams, additionalParameter?: { key: string; value: string }): Observable<ApiResponse> {
    let httpParams = new HttpParams({ fromObject: params });
    if (additionalParameter) {
      httpParams = httpParams.append(additionalParameter.key, additionalParameter.value);
    }
    return this.get(ApiConfig.showcases, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
    );
  }

  /**
   * Get one application item by id
   * @param {string} id
   * @returns {Observable<any>}
   */
  getOne(id: string): Observable<any> {
    return this.get(ApiConfig.showcases + '/' + id).pipe(
      map(response => response['data']),
      publishReplay(1),
      refCount(),
    );
  }

  /**
   * Get related datasets for a given application item
   * @param {string} id
   * @param {{}} params
   * @returns {Observable<ApiResponse>}
   */
  getDatasets(id: string, params = {}): Observable<ApiResponse> {
    const url = TemplateHelper.parseUrl(ApiConfig.showcasesDatasets, { id: id });
    const httpParams = new HttpParams({ fromObject: params });
    return this.get(url, httpParams).pipe(map(response => new ApiResponse(response)));
  }

  /**
   * Sends application data
   * @param {[key: string]: string} application
   * @returns {Observable<ApiResponse>}
   */
  suggest(application: { [key: string]: string }): Observable<ApiResponse> {
    const payload = `{
            "data": {
                "type": "application",
                "attributes": ${JSON.stringify(application)}
            }
        }`;
    return this.post(ApiConfig.suggestShowcases, JSON.parse(payload));
  }
}

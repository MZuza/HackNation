import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from './api';

import { SearchHttpParamEncoder } from '@app/services/http/SearchHttpParamEncoder';
import { RestService } from '@app/services/rest.service';

/**
 *  Service that handles search suggestions
 */
@Injectable({
  providedIn: 'root',
})
export class SearchSuggestionsService extends RestService {
  /**
   * Gets suggestions
   * @param {string} phrase
   * @param {string[]} apiModels
   * @param {number} maxResultsPerModel
   * @returns {Observable<any[]>}
   */
  getSuggestions(phrase: string, apiModels: string[] = [], maxResultsPerModel: number): Observable<any[]> {
    let httpParams = new HttpParams({ encoder: new SearchHttpParamEncoder() });
    httpParams = httpParams.append('q', phrase);
    httpParams = httpParams.append('models', apiModels.map(model => model.trim()).join(','));
    httpParams = httpParams.append('per_model', maxResultsPerModel.toString());

    return this.get(ApiConfig.searchSuggest, httpParams);
  }
}

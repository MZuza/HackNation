import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicPageParams } from './models/page-params';

import { ApiConfig } from '@app/services/api';
import { RestService } from '@app/services/rest.service';
import { LinkHelper } from '@app/shared/helpers';

/**
 * Search history service
 * Fetches search terms typed in search box in dataset, application and articles modules
 */
@Injectable()
export class SearchHistoryService extends RestService {
  /**
   * Gets search history grouped by date
   * @param {number} [page]
   * @returns {Observable<GroupedSearchHistory>}
   */
  getGroupedSearchHistory(page: number = 1): Observable<GroupedSearchHistory> {
    return this.get(ApiConfig.searchHistory, { per_page: 100, page: page, sort: '-modified' }).pipe(map(data => this.groupByDate(data)));
  }

  /**
   * Groups history by date
   * @param {any} historyResponse
   * @returns {GroupedSearchHistory}
   */
  private groupByDate(historyResponse: any): GroupedSearchHistory {
    const regex = /.*\/(\w*)/;
    return historyResponse.data.reduce((object: GroupedSearchHistory[], item: any) => {
      const date = moment(item.attributes.modified).format('YYYY.MM.DD');
      const queryString = item.attributes.url.split('?')[1];
      const params = LinkHelper.parseQueryString(queryString);
      let resource = regex.exec(item.attributes.url)[1];

      if (resource.endsWith('s')) {
        resource = resource.substring(0, resource.length - 1);
      }

      if (!object[date]) {
        object[date] = [];
      }

      object[date].push({
        params: params,
        resource: resource,
        sentence: item.attributes.query_sentence,
      });

      return object;
    }, {}) as GroupedSearchHistory;
  }
}

export interface GroupedSearchHistory {
  [key: string]: SearchHistoryQuery[];
}

export interface SearchHistoryQuery {
  params: BasicPageParams;
  resource: string;
  sentence: string;
}

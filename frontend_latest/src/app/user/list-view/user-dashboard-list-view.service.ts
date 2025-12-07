import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RestService } from '@app/services/rest.service';
import { ApiResponse } from '@app/services/api';
import { BasicPageParams } from '@app/services/models/page-params';
import { NotificationsService } from '@app/services/notifications.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API_URL } from '@app/user/list-view/API_URL';
import { DOCUMENT } from '@angular/common';
import { LoginService } from '@app/services/login-service';

/**
 * User Dashboard List View Services that handles communication with API
 */
@Injectable()
export class UserDashboardListViewService extends RestService {
  constructor(
    http: HttpClient,
    translate: TranslateService,
    router: Router,
    notificationService: NotificationsService,
    storageService: LocalStorageService,
    cookieService: CookieService,
    loginService: LoginService,
    @Inject(DOCUMENT) document: any,
    @Inject(PLATFORM_ID) platformId: string,
    @Optional() @Inject(API_URL) private readonly apiURL: string,
  ) {
    super(http, translate, router, notificationService, storageService, cookieService, loginService, document, platformId);
  }

  /**
   * Get Items list from given filters in `params` variable
   * @param {ICategoryPageParams} params
   * @returns {Observable<ApiResponse>}
   */
  getAll(params: BasicPageParams): Observable<ApiResponse> {
    const httpParams = new HttpParams({ fromObject: params });

    return this.get(this.apiURL, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
    );
  }

  /**
   * Get one item item with given id
   * @param {string} id
   * @returns {any}
   */
  getOne(id: string) {
    return this.get(this.apiURL + '/' + id).pipe(
      map(response => response['data']),
      publishReplay(1),
      refCount(),
    );
  }
}

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { ApiConfig } from '@app/services/api';
import { LoginService } from '@app/services/login-service';
import { NotificationsService } from '@app/services/notifications.service';
import { RestService } from '@app/services/rest.service';

/**
 * Institutions sevice that handles communication with Institutions API `\/institutions`
 * @api https://api.dane.gov.pl/institutions
 */
@Injectable()
export class InstitutionsService extends RestService {
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
   * Get one institution item from a given id
   * @param {string} id
   * @returns {Observable<any>}
   */
  getOne(id: string): Observable<any> {
    return this.get(ApiConfig.institutions + '/' + id).pipe(
      map(response => response['data']),
      publishReplay(1),
      refCount(),
    );
  }
}

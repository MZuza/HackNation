import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

import { ApiConfig } from '@app/services/api';
import { LoginService } from '@app/services/login-service';
import { NotificationsService } from '@app/services/notifications.service';
import { RestService } from '@app/services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class DgaService extends RestService {

  readonly ApiConfig = ApiConfig;

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

  getDgaAggregatedData() {
    return this.get(this.ApiConfig.dga_aggregated);
  }
}

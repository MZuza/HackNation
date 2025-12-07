import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiConfig } from '@app/services/api';
import { LoginService } from '@app/services/login-service';
import { HttpCustomErrorResponse, IErrorBackend } from '@app/services/models';
import { UserToken } from '@app/services/models/user-token';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Parent service for each api service that handles underlying requirements
 */
@Injectable()
export abstract class RestService {
  /**
   * Base url
   * @type {string}
   */
  public base_url: string;
  /**
   * Token
   * @type {string}
   */
  public token: string;
  /**
   * Api Endpoint url
   * @type {string}
   */
  /**
   * Jwt helper service instance
   */
  public jwtHelperService;

  private readonly API = '/api';
  /**
   * Request errors without notifications
   * @type {string[]}
   */
  private readonly requestsErrorsWithoutNotifications: string[] = [ApiConfig.unsubscribeNewsletter, ApiConfig.confirmSubscribeNewsletter];
  /**
   * Cookie domain
   * @type {string}
   */
  private cookie_domain: string;

  /**
   * Session expires
   */
  private sessionExpires;

  /**
   * Cookie Prefix
   * @type {string}
   */
  private cookie_prefix: string = '';

  /**
   * Dependency injection required for api calls, and base_url setup
   * @param {HttpClient} http
   * @param {TranslateService} translate
   * @param {Router} router
   * @param {NotificationsService} notificationService
   * @param {LocalStorageService} storageService
   * @param {CookieService} cookieService
   * @param loginService
   * @param document
   * @param {string} platformId
   */
  constructor(
    protected http: HttpClient,
    protected translate: TranslateService,
    protected router: Router,
    protected notificationService: NotificationsService,
    protected storageService: LocalStorageService,
    protected cookieService: CookieService,
    protected loginService: LoginService,
    @Inject(DOCUMENT) protected document: Document,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.jwtHelperService = new JwtHelperService();
    if (!environment.production) {
      const currentUrl = this.document.location.hostname.replace('www.', '');
      this.base_url = this.API;
      this.cookie_domain = currentUrl;
    } else {
      this.base_url = this.document.location.protocol + '//api.' + this.document.location.hostname.replace('www.', '');
      this.base_url += ApiConfig.apiVersion;
      this.cookie_domain = '.' + this.document.location.hostname.replace('www.', '');
    }
    const regex = /^(\w*)\.?dane\.gov\.pl$/gi;
    const prefixArr = regex.exec(this.document.location.hostname.replace('www.', ''));
    this.cookie_prefix = !prefixArr ? 'local_' : prefixArr[1] ? `${prefixArr[1]}_` : '';

    this.initHeaders();
  }

  private _headers: HttpHeaders;

  /**
   * Access to headers to child services
   * @returns {HttpHeaders}
   */
  protected get headers(): HttpHeaders {
    return this._headers;
  }

  /**
   * Allow overwriting headers from child services
   * @param {HttpHeaders} value
   */
  protected set headers(value: HttpHeaders) {
    this._headers = value;
  }

  /**
   * Setup token, save it in browser and setup admin user cookie
   * @param {string} token
   * @param {boolean} remember
   */
  setToken(token: string, remember: boolean = false) {
    this.token = token;

    const jwtData: any = this.jwtHelperService.decodeToken(this.token);
    const isSecure = this.document.location.protocol === 'https:';

    if (jwtData.user && jwtData.user.session_key) {
      this.cookieService.set(
        `${this.cookie_prefix}sessionid`,
        jwtData.user.session_key,
        new Date(jwtData.exp * 1000),
        '/',
        this.cookie_domain,
        isSecure,
        'Lax',
      );
    }

    this.cookieService.set(
      `${this.cookie_prefix}apiauthtoken`,
      token,
      new Date(jwtData.exp * 1000),
      '/',
      this.cookie_domain,
      isSecure,
      'Lax',
    );

    this.storageService.set('remember', remember ? 'true' : 'false');
  }

  /**
   * Get token if available, and validate expiration date
   * @returns {string}
   */
  getToken(): string {
    this.token = this.cookieService.get(`${this.cookie_prefix}apiauthtoken`);
    if (this.token) {
      const remember: boolean = Boolean(this.storageService.get('remember'));
      this.sessionExpires = this.getTokenData().exp;
      const currentTime: number = moment().unix();
      if (remember && this.getTokenData().exp > currentTime) {
        return this.token;
      }
      if (!remember && this.getTokenData().iat + 3600 * 12 > currentTime) {
        return this.token;
      }
      this.token = null;
    }
    return this.token;
  }

  /**
   * Decode JWT Token and provide its data
   * @returns {any}
   */
  public getTokenData(): UserToken {
    return <UserToken>this.jwtHelperService.decodeToken(this.token);
  }

  /**
   * Clear any session traces, remove jwt token and session cookie
   */
  clearToken() {
    this.token = null;
    this.storageService.remove('remember');
    this.cookieService.delete(`${this.cookie_prefix}apiauthtoken`, '/', this.cookie_domain);
    this.cookieService.delete(`${this.cookie_prefix}sessionid`, '/', this.cookie_domain);
  }

  /**
   * Return array with errors or null
   * @param {HttpCustomErrorResponse} err
   * @returns {IErrorBackend [] | null}
   */
  getBackendErrors(err: HttpCustomErrorResponse): IErrorBackend[] | null {
    return err.error && err.error.errors ? err.error.errors : null;
  }

  /**
   * Overridable GET Method Api call
   * @param {string} relativeUrl
   * @param params
   * @param skip404Redirect
   * @returns {Observable<any>}
   */
  protected get(relativeUrl: string, params?: any, skip404Redirect?: boolean): Observable<any> {
    return this.request('get', this.base_url + relativeUrl, params, skip404Redirect);
  }

  /**
   * Overridable DELETE Method Api Call
   * @param {string} relativeUrl
   * @param params
   * @returns {Observable<any>}
   */
  protected delete(relativeUrl: string, params?: any): Observable<any> {
    return this.request('delete', this.base_url + relativeUrl, params);
  }

  /**
   * Overridable POST Method API Call
   * @param {string} relativeUrl
   * @param payload
   * @param params
   * @returns {Observable<any>}
   */
  protected post(relativeUrl: string, payload?: any, params?: any): Observable<any> {
    return this.requestWithPayload('post', this.base_url + relativeUrl, payload, params);
  }

  /**
   * Overridable PUT Method Api Call
   * @param {string} relativeUrl
   * @param payload
   * @param params
   * @returns {Observable<any>}
   */
  protected put(relativeUrl: string, payload?: any, params?: any): Observable<any> {
    return this.requestWithPayload('put', this.base_url + relativeUrl, payload, params);
  }

  /**
   * Overridable PATCH Method Api Call
   * @param {string} relativeUrl
   * @param payload
   * @param params
   * @returns {Observable<any>}
   */
  protected patch(relativeUrl: string, payload?: any, params?: any): Observable<any> {
    return this.requestWithPayload('patch', this.base_url + relativeUrl, payload, params);
  }

  /**
   * Basic Api Call method without payload
   * @param {"get" | "delete"} method
   * @param url
   * @param params
   * @param skip404Redirect
   * @returns {Observable<any>}
   */
  protected request(method: 'get' | 'delete', url, params?: any, skip404Redirect?: boolean): Observable<any> {
    this.initHeaders();
    return this.http.request(method, url, {
      headers: this.headers,
      withCredentials: true,
      params: params,
    }).pipe(catchError(this.errorRedirectionHandler.bind(this, skip404Redirect)));
  }

  /**
   * Basic Api Call method with payload
   * @param {"post" | "put"} method
   * @param url
   * @param payload
   * @param params
   * @returns {Observable<any>}
   */
  protected requestWithPayload(method: 'post' | 'put' | 'patch', url, payload?: any, params?: any): Observable<any> {
    this.initHeaders();
    return this.http[method](url, payload, {
      headers: this.headers,
      withCredentials: true,
      params: params,
    }).pipe(catchError(this.errorNotificationHandler.bind(this)));
  }

  /**
   * Check if session is active i.e. if user is logged in
   * @returns {boolean}
   */
  protected checkSession(): boolean {
    const token: string = this.getToken();
    if (token) {
      this.token = token;
      this._headers = this._headers.append('Authorization', 'Bearer ' + token);
      this.loginService.next(true);
      return true;
    }
    this._headers = this._headers.delete('Authorization');
    this.loginService.next(false);
    return false;
  }

  /**
   * Global error handler for all API calls
   * Here 404 redirection is created for GET Methods
   * @param skip404Redirect
   * @param {HttpCustomErrorResponse} err
   * @returns {Observable}
   */
  protected errorRedirectionHandler(skip404Redirect: boolean = false, err: HttpCustomErrorResponse): Observable<never> {
    if (err.status === 404) {
      if (!skip404Redirect) {
        this.router.navigate(['/404']);
      }
      return throwError(err);
    }
    return this.errorNotificationHandler(err);
  }

  /**
   * Global error handler for all API calls
   * Here notifications are created
   * @param {HttpCustomErrorResponse} err
   * @returns {Observable}
   */
  protected errorNotificationHandler(err: HttpCustomErrorResponse): Observable<never> {
    let error = err.error;
    const isdBackendErrorVisible = this.checkBackendErrorVisibility(err.url);
    if (typeof error === 'string') {
      error = JSON.parse(error);
    }
    if (isdBackendErrorVisible && navigator.onLine) {
      const errors: IErrorBackend[] = this.getBackendErrors({ ...err, error: error });
      if (errors) {
        errors.forEach((e: IErrorBackend) => {
          this.notificationService.addError(e.detail || e.title);
        });
      } else {
        this.notificationService.addError('Unknown error');
      }
    }

    return throwError(err);
  }

  /**
   * Should backend error be visible by notification service
   * Here notifications are created
   * @param {string} requestUrl
   * @returns {boolean}
   */
  private checkBackendErrorVisibility(requestUrl: string): boolean {
    const separator = this.base_url === this.API ? this.API : ApiConfig.apiVersion;
    const urlParts = requestUrl.split(separator);

    if (urlParts.length !== 2) {
      return true;
    }

    const checkedUrlResults = this.requestsErrorsWithoutNotifications.map((noNotificationUrl: string) => {
      return (
        new RegExp(noNotificationUrl.replace(':resourceId', '[0-9]+'), 'i').test(urlParts[1]) ||
        new RegExp(noNotificationUrl.replace(':token', `[A-Za-z0-9\\-\\_]+`), 'i').test(urlParts[1]) ||
        new RegExp(noNotificationUrl.replace(':id', '[0-9]+'), 'i').test(urlParts[1])
      );
    });

    return !checkedUrlResults.some(val => val === true);
  }

  /**
   * Initial headers setup, creates headers, checks active sessions, and sets browser's active language
   */
  private initHeaders() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Accept-Language', this.translate.currentLang);
    this.checkSession();
  }
}

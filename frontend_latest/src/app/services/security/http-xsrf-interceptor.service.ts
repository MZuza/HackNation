import { DOCUMENT } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '@app/app.config';
import { CookieExtractor } from '@app/services/security/cookie-extractor.service';

@Injectable()
export class HttpXsrfInterceptorService implements HttpInterceptor {
  /**
     @ignore
     */
  constructor(private readonly cookieExtractor: CookieExtractor, @Inject(DOCUMENT) private readonly document: Document) {}

  /**
   * Intercepts http request and adds CSRF token if needed
   * @param req
   * @param next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lowerCaseURL = req.url.toLowerCase();

    if (req.method === 'GET' || req.method === 'HEAD' || !this.isRequestToApi(lowerCaseURL)) {
      return next.handle(req);
    }

    const token = this.cookieExtractor.getToken();

    if (token !== null && !req.headers.has(APP_CONFIG.csrfToken)) {
      req = req.clone({ headers: req.headers.set(APP_CONFIG.csrfToken, token) });
    }
    return next.handle(req);
  }

  /**
   * Checks if request goes to API endpoint
   * @param url
   * @returns {boolean}
   */
  isRequestToApi(url: string): boolean {
    if (!this.isProductionEnv()) {
      return url.includes('/api');
    }
    return url.startsWith(this.document.location.protocol + '//api.' + this.document.location.hostname.replace('www.', ''));
  }

  /**
   * Checks if environment is production
   * @returns {boolean}
   */
  protected isProductionEnv(): boolean {
    return environment.production;
  }
}

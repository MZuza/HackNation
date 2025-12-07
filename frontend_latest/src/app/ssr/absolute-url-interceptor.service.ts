import { DOCUMENT } from '@angular/common';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

/**
 * Absolute URL Interceptor
 */
@Injectable()
export class AbsoluteUrlInterceptor implements HttpInterceptor {
  /**
   * @ignore
   */
  constructor(@Inject(DOCUMENT) protected document: Document) {}

  /**
   * Adds absolute path to http request url when needed
   * @param req
   * @param next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let newUrl;
    if (req.url.startsWith('/')) {
      newUrl = `${this.document.location.protocol}//${this.document.location.host}${req.url}`;
    } else {
      newUrl = req.url;
    }
    return next.handle(req.clone({ url: newUrl }));
  }
}

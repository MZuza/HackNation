/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef, Injectable, NgModule, makeStateKey, StateKey, TransferState } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable, of as observableOf } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

/**
 * Transfer Http Response
 */
export interface TransferHttpResponse {
  body?: any | null;
  headers?: { [k: string]: string[] };
  status?: number;
  statusText?: string;
  url?: string;
}

/**
 * Gets headers map
 * @param headers
 * @returns {Record<string, string[] | null>}
 */
function getHeadersMap(headers: HttpHeaders) {
  const headersMap: Record<string, string[] | null> = {};
  for (const key of headers.keys()) {
    headersMap[key] = headers.getAll(key);
  }

  return headersMap;
}

/**
 * Transfer Http Cache Interceptor
 */
@Injectable()
export class TransferHttpCacheInterceptor implements HttpInterceptor {
  /**
   * Cache active flag
   * @type {boolean}
   */
  private isCacheActive = true;

  /**
   * @ignore
   */
  constructor(appRef: ApplicationRef, private transferState: TransferState) {
    // Stop using the cache if the application has stabilized, indicating initial rendering is
    // complete.
    // tslint:disable-next-line: no-floating-promises
    appRef.isStable
      .pipe(
        filter((isStable: boolean) => isStable),
        take(1),
      )
      .toPromise()
      .then(() => {
        this.isCacheActive = false;
      });
  }

  /**
   * Intercepts http requests and cache it
   * @param req
   * @param next
   * @returns {Observable<HttpResponse<any>> }
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Stop using the cache if there is a mutating call.
    if ((req.method !== 'GET' && req.method !== 'HEAD' && !req.url.includes('client/register')) || !!req.headers.get('authorization')) {
      this.isCacheActive = false;
      this.invalidateCacheEntry(req.url);
    }

    if (!this.isCacheActive) {
      // Cache is no longer active. Pass the request through.
      return next.handle(req);
    }

    const storeKey = this.makeCacheKey(req.method, req.url, req.params);

    if (this.transferState.hasKey(storeKey)) {
      // Request found in cache. Respond using it.
      const response: any = this.transferState.get<any>(storeKey, {} as TransferHttpResponse);

      return observableOf(
        new HttpResponse<any>({
          body: response.body,
          headers: new HttpHeaders(response.headers),
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        }),
      );
    } else {
      // Request not found in cache. Make the request and cache it.
      const httpEvent = next.handle(req);

      return httpEvent.pipe(
        tap((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            this.transferState.set<any>(storeKey, {
              body: event.body,
              headers: getHeadersMap(event.headers),
              status: event.status,
              statusText: event.statusText,
              url: event.url || '',
            });
          }
        }),
      );
    }
  }

  /**
   * Invalidates cache
   * @param url
   */
  private invalidateCacheEntry(url: string): void {
    Object.keys(this.transferState['store']).forEach(key => (key.includes(url) ? this.transferState.remove(makeStateKey(key)) : null));
  }

  /**
   * Makes cache key
   * @param method
   * @param url
   * @param params
   * @returns {StateKey<TransferHttpResponse>}
   */
  private makeCacheKey(method: string, url: string, params: HttpParams): StateKey<TransferHttpResponse> {
    // make the params encoded same as a url so it's easy to identify
    const encodedParams = params
      .keys()
      .sort()
      .map(k => `${k}=${params.get(k)}`)
      .join('&');
    const key = (method === 'GET' ? 'G.' : 'H.') + url + '?' + encodedParams;

    return makeStateKey<TransferHttpResponse>(key);
  }
}

/**
 * An NgModule used in conjunction with `ServerTransferHttpCacheModule` to transfer cached HTTP
 * calls from the server to the client application.
 */
@NgModule({
  imports: [BrowserModule],
  providers: [TransferHttpCacheInterceptor, { provide: HTTP_INTERCEPTORS, useExisting: TransferHttpCacheInterceptor, multi: true }],
})
export class TransferHttpCacheModule {}

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {finalize, shareReplay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {

  cache: Map<string, HttpEvent<unknown>> = new Map();
  queue: Map<string, Observable<HttpEvent<unknown>>> = new Map();

  currentUrl: string = '';

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.router.url !== this.currentUrl) {
      this.currentUrl = this.router.url;

      this.cache.clear();
      this.queue.clear();
    }

    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const queued = this.queue.get(req.urlWithParams);
    if (queued) {
      return queued;
    }

    const cached = this.cache.get(req.urlWithParams);
    if (cached) {
      return of(cached);
    }

    const shared = next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, event.clone());
        }
      }),
      finalize(() => this.queue.delete(req.urlWithParams)),
      shareReplay()
    );

    this.queue.set(req.urlWithParams, shared);

    return shared;
  }
}

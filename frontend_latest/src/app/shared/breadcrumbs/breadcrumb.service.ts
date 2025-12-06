import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { Breadcrumb } from '@app/shared/breadcrumbs/Breadcrumb';
import { BreadcrumbConfig } from '@app/shared/breadcrumbs/BreadcrumbConfig';
import { TemplateHelper } from '@app/shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private translate: TranslateService) {}

  /**
   * Returns Breadcrumbs
   * @returns {Observable<Array<Breadcrumb>>}
   */
  getBreadcrumbs(): Observable<Array<Breadcrumb>> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      switchMap(() => this.buildBreadcrumb(this.activatedRoute.root)),
    );
  }

  /**
   * Returns reversed breadcrumb array
   * @returns {Observable<any[]>}
   */
  getReversedBreadcrumbsLabels(): Observable<Array<string>> {
    return this.getBreadcrumbs().pipe(
      map(breadcrumbs => {
        const filteredBreadcrumbs = [];
        breadcrumbs.forEach(breadcrumb => {
          if (breadcrumb.label) {
            filteredBreadcrumbs.push(breadcrumb);
          }
        });
        return filteredBreadcrumbs;
      }),
    );
  }

  /**
   * Builds breadcrumbs path elements - recursive function.
   * @param {ActivatedRoute} route
   * @param {string} [url]
   * @param {Array<any>} [breadcrumbs]
   * @returns {any}
   */
  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<any> = []): Observable<Array<Breadcrumb>> {
    const path = this.getPath(route);

    const params = this.getParams(url, route);

    return this.getTitle(route, path).pipe(
      switchMap(title => {
        const { nextUrl, segments } = this.parseCurrentUrl(url, path, params);

        const breadcrumb: Breadcrumb = {
          label: title,
          url: nextUrl,
          lastChild: true,
          segments: segments,
          params: params,
        };

        const newBreadcrumbs = breadcrumb ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

        if (route.firstChild) {
          breadcrumb.lastChild = false;
          return this.buildBreadcrumb(route.firstChild, nextUrl, newBreadcrumbs);
        } else if (!!newBreadcrumbs[newBreadcrumbs.length - 1]) {
          newBreadcrumbs[newBreadcrumbs.length - 1].lastChild = true;
        }

        return of(newBreadcrumbs.map(({ label, lastChild, segments }) => ({ label, lastChild, segments })));
      }),
    );
  }

  /**
   * Parses url returned by Angular router
   * @param url
   * @param path
   * @param params
   * @returns {{nextUrl: string, segments: string[]}}
   */
  private parseCurrentUrl(url: string, path: string, params: Params): { nextUrl: string; segments: string[] } {
    let nextUrl = `${url}${path}/`;

    nextUrl = TemplateHelper.parseUrl(nextUrl, params as any[]);

    // Prepare clean array of segments for [routerLink]
    let segments = nextUrl.split('/');
    segments.unshift('/'); // Start from root
    segments = segments.filter(n => !!n); // Filter out empty strings, nulls and undefined
    return { nextUrl, segments };
  }

  /**
   * Returns page title
   * @param route
   * @param path
   * @returns {Observable<string> | Observable<any>}
   */
  private getTitle(route: ActivatedRoute, path: string): Observable<any> {
    if (!route.routeConfig) {
      return this.translate.stream('Breadcrumbs.Root');
    }
    if (route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumbs']) {
      const breadcrumbs: BreadcrumbConfig = route.routeConfig.data['breadcrumbs'];
      if (breadcrumbs.label) {
        return of(breadcrumbs.label);
      }

      if (breadcrumbs.dataKey) {
        return of(this.getKeyFromObject(breadcrumbs.dataKey, route.snapshot.data));
      }

      if (breadcrumbs.translationKey) {
        const key = breadcrumbs.translationKey;
        return this.translate.stream(key);
      }
    }

    return this.getDefaultTitle(route);
  }

  /**
   * Returns default title
   * @param route
   * @returns {Observable<any> | Observable<string>}
   */
  private getDefaultTitle(route: ActivatedRoute): Observable<string> {
    const componentName = route.routeConfig.component && route.routeConfig.component.name;
    if (componentName) {
      return this.translate.stream('Breadcrumbs.' + componentName);
    }
    return of('');
  }

  /**
   * Returns params for current route url
   * @param url
   * @param route
   * @returns {Params}
   */
  private getParams(url: string, route: ActivatedRoute): Params {
    return url !== '' && route.snapshot && route.snapshot.params ? route.snapshot.params : null;
  }

  /**
   * Returns path for current route url
   * @param route
   * @returns {string}
   */
  private getPath(route: ActivatedRoute): string {
    return route.routeConfig && route.routeConfig.path ? route.routeConfig.path : '';
  }

  /**
   * Parses string keys and returns key value form object
   * @param key
   * @param obj
   * @returns {any}
   */
  private getKeyFromObject(key: string, obj: Object): string {
    if (!key.includes('.')) {
      return obj[key];
    }
    return key.split('.').reduce((o, i) => o[i], obj);
  }
}

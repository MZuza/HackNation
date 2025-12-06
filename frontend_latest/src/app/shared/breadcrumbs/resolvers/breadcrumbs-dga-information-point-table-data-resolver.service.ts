import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CmsService } from '@app/services/cms.service';
import { DatasetService } from '@app/services/dataset.service';
import { DgaService } from '@app/services/dga.service';

export const breadcrumbsDgaInformationPointTableDataResolverService = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const dgaService = inject(DgaService);
  const datasetService = inject(DatasetService);
  const cmsService = inject(CmsService);
  const router = inject(Router);

  const getMoreData = (data): Observable<any> => {
    const lang = route.queryParams.lang;
    const url = state.url.substring(3);
    const slicedUrl = url.slice(0, url.lastIndexOf('/'));
    const rev = route.queryParams.rev;

    return combineLatest([
      of(data),
      datasetService.getResourceById(data.resource_id),
      datasetService.getDatasetsStats(data.dataset_id, data.dataset_slug),
      cmsService.getLandingPage(slicedUrl, lang, rev)
    ]).pipe(map(([resData, resource, stats, cms]) => {
      return {
        resData,
        resource,
        stats,
        cms
      };
    }));
  };

  return dgaService.getDgaAggregatedData().pipe(
    switchMap(responseData => getMoreData(responseData)),
    catchError((err) => {
      console.warn('Couldn\'t load data');
      router.navigate(['/']).then();
      return EMPTY;
    }));
};



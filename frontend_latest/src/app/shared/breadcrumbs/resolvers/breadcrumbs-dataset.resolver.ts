import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DatasetService } from '@app/services/dataset.service';

/**
 * Breadcrumbs Resolver for /datasets page
 */

export const breadcrumbsDatasetResolver = (route: ActivatedRouteSnapshot) => {
  const datasetService = inject(DatasetService);
  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @returns {any}
   */
  return datasetService
    .getOneById(route.paramMap.get('id'))
    .pipe(
      catchError(() => of())
    );
};

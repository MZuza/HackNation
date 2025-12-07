import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DatasetService } from '@app/services/dataset.service';

/**
 * Breadcrumbs Resolver for /datasets/resources page
 */
export const breadcrumbsResourceResolver = (route: ActivatedRouteSnapshot) => {
  const datasetService = inject(DatasetService);

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @returns {any}
   */
  return datasetService
    .getResourceById(route.paramMap.get('resourceId'))
    .pipe(
      catchError(() => of())
    );
};

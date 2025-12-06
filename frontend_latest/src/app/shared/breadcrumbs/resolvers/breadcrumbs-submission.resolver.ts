import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DatasetService } from '@app/services/dataset.service';

/**
 * Breadcrumbs Resolver for /articles page
 */

export const breadcrumbsSubmissionResolver = (route: ActivatedRouteSnapshot) => {
  const datasetService = inject(DatasetService);

  return datasetService
    .getSubmission(route.paramMap.get('id'))
    .pipe(
      catchError(() => of())
    );
};

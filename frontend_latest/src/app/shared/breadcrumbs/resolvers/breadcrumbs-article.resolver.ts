import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CmsService } from '@app/services/cms.service';

/**
 * Breadcrumbs Resolver for /articles page
 */
  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @returns {any}
   */

export const breadcrumbsArticleResolver = (route: ActivatedRouteSnapshot): any => {
  const cmsService = inject(CmsService);

  return cmsService.getNewsWidgets(route.params.id).pipe(catchError(() => of()));
};

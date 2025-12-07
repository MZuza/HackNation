import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InstitutionsService } from '@app/services/institutions.service';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';

/**
 * Breadcrumbs Resolver for /institutions page
 */
export const breadcrumbsInstitutionResolver = (route: ActivatedRouteSnapshot) => {
  const institutionService = inject(InstitutionsService);

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @returns {any}
   */

  return institutionService.getOne(ActivatedRouteHelper.getRoutingId(route)).pipe(catchError(() => of()));
};

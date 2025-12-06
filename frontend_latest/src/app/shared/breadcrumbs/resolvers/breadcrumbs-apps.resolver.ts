import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationsService } from '@app/services/applications.service';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';

/**
 * Breadcrumbs Resolver for /applications page
 */
export const breadcrumbsAppsResolver = (route: ActivatedRouteSnapshot) => {
  const applicationService = inject(ApplicationsService);

  return applicationService.getOne(ActivatedRouteHelper.getRoutingId(route)).pipe(catchError(() => of()));
};

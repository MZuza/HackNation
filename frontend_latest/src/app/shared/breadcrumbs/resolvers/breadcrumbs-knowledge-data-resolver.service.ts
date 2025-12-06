import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CmsService } from '@app/services/cms.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

/**
 * Breadcrumbs Resolver for knowledgebase pages
 */
export const breadcrumbsKnowledgeBaseDataResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const routerEndpoints = RouterEndpoints;

  const cmsService = inject(CmsService);
  const router = inject(Router);

  let rev: string;
  const lang = route.queryParams.lang;
  let url = '/' + routerEndpoints.KNOWLEDGE_BASE;

  if (route.data['details']) {
    url = state.url.substring(3);
    rev = route.queryParams.rev;
  }
  return cmsService.getLandingPage(url, lang, rev).pipe(
    catchError((err) => {
      cmsService.displayCmsErrorMessage(url, err.message);
      router.navigate(['/']).then();
      return EMPTY;
    })
  );
};

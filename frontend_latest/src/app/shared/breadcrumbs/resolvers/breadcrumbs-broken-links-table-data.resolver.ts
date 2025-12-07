import { inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrokenLinksService } from '@app/services/broken-links.service';
import { CmsService } from '@app/services/cms.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

export const breadcrumbsBrokenLinksTableDataResolver = (route, state) => {
  const cmsService = inject(CmsService);
  const brokenLinksService = inject(BrokenLinksService);
  const slug = RouterEndpoints.BROKEN_LINKS;

  const url = '/report/' + slug;

  return combineLatest([
    cmsService.getLandingPage(url),
    brokenLinksService.getBrokenLinksApiData()
  ]).pipe(map(([cmsData, apiData]) => {
    return {
      cmsData,
      apiData
    };
  }));
};

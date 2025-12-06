import { inject } from '@angular/core';

import { CmsService } from '@app/services/cms.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

export const breadcrumbsDgaInformationPointTabDataResolverService = () => {

  const cmsService: CmsService = inject(CmsService);
  const routerEndpoints = RouterEndpoints;

  const url = '/' + routerEndpoints.DGA;
  return cmsService.getLandingPage(url);

};


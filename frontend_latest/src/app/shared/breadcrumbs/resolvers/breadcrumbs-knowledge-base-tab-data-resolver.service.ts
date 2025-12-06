import { ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';

import { IMetadataPageChildrenCms } from '@app/services/models/cms/metadata-page-cms';

/**
 * Breadcrumbs Resolver for knowledgebase tab pages
 */

export const breadcrumbsKnowledgeBaseTabDataResolverService =
  (route: ActivatedRouteSnapshot): Observable<Array<IMetadataPageChildrenCms>> => {
  if (route.parent.data?.['post']?.meta?.children) {
    return of(route.parent.data['post'].meta.children);
  }
  return EMPTY;
};

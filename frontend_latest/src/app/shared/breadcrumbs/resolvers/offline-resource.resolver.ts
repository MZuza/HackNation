import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';

/**
 * Offline Resolver for /datasets/resources page
 */
export const offlineResourceResolver = (route: ActivatedRouteSnapshot) => {

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @returns {any}
   */

  if (!!!route.parent.data['post']) {
    return of();
  }
  return of(route.parent.data['post']);
};

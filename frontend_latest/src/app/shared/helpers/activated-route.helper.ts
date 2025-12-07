import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

/**
 * Activated Route Helper
 */
export class ActivatedRouteHelper {

    /**
     * Gets param from current or parent route
     * @param {ActivatedRoute} activatedRoute
     * @param {string }paramName
     * @returns {string} param from current or parent route
     */
    static getParamFromCurrentOrParentRoute(activatedRoute: ActivatedRoute, paramName: string): string {
        if (activatedRoute.snapshot.params[paramName]) {
            return activatedRoute.snapshot.params[paramName];
        } else if (activatedRoute.parent.snapshot.params[paramName]) {
            return activatedRoute.parent.snapshot.params[paramName];
        }

        return null;
    }

    /**
     * Gets data from current or parent route
     * @param {ActivatedRoute} activatedRoute
     * @param {string} paramName
     * @returns {any}
     */
    static getRouteData(activatedRoute: ActivatedRoute, paramName: string) {
        if (activatedRoute.snapshot.data[paramName]) {
            return activatedRoute.snapshot.data[paramName];
        } else if (activatedRoute.parent.snapshot.data[paramName]) {
            return activatedRoute.parent.snapshot.data[paramName];
        }
    }

    /**
     * extract id from url
     * @param {ActivatedRouteSnapshot} route
     */
    static getRoutingId(route: ActivatedRouteSnapshot): string {
        const id: string = route.paramMap.get('id');
        const dashIndex: number = id.indexOf('-');
        const commaIndex = id.indexOf(',');
        let finalId = '';

        if (dashIndex > commaIndex) {
            finalId = id.slice(0, commaIndex);
        } else {
            const idWithoutDash = id.slice(dashIndex + 1, id.length);
            const commaIndexWithoutDash = idWithoutDash.indexOf(',');
            finalId = idWithoutDash.slice(0, commaIndexWithoutDash);
        }

        return finalId;
    }
}

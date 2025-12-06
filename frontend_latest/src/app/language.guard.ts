import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Language Guard
 * Redirect user to language specific url when none language provided in url
 */
@Injectable({
    providedIn: 'root'
})
export class LanguageGuard  {
    constructor(private router: Router,
                private translate: TranslateService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (next.url[0].path === 'pl' || next.url[0].path === 'en') {
            return true;
        }
        this.router.navigate([this.translate.currentLang, ...next.url.map(urlSegment => urlSegment.path)]);
        return false;
    }
}

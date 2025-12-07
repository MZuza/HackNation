import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable } from 'rxjs';

import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';

/**
 * Auth Guard
 */
@Injectable()
export class AuthGuard  {
  /**
   * @ignore
   */
  constructor(
    private userService: UserService,
    private userStateService: UserStateService,
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
  ) {}

  /**
   * Determines whether route can be activated
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>} activate
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.userStateService.getCurrentUser();
    return this.checkLogin(state.url);
  }

  /**
   * Checks login for specified url and redirects user
   * @param {string} url
   * @returns {Observable<boolean>} login
   */
  checkLogin(url: string): Observable<boolean> {
    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;

    // Navigate to the login page with extras
    return new Observable(observer => {
      this.userStateService.getCurrentUser().subscribe(
        data => {
          if (!data) {
            this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as [], { queryParams: { redirect: url } });
            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        },
        () => {
          this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as [], { queryParams: { redirect: url } });
          observer.next(false);
        },
      );
    });
  }
}

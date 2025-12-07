import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard  {
  /**
   * @ignore
   */
  constructor(private readonly userService: UserService, private readonly router: Router) {}

  /**
   * Checks if current user role is allowed to activate route
   * @param next
   * @param state
   * @returns {boolean}
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.userService.hasRequiredRole(next.data['roles'])) {
      this.router.navigate(['/']).then();
      return false;
    }
    return true;
  }
}

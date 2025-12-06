import { Injectable } from '@angular/core';
import { defer, Observable, ReplaySubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { User } from '@app/services/models';
import { UserService } from '@app/services/user.service';
import { DiscourseService } from '@app/user/forum/discourse.service';

/**
 * User State Service
 */
@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  /**
   * Current user
   * @type {User}
   */
  private currentUser: User;

  /**
   * Determines if data is fetching
   * @type {boolean}
   */
  private isFetching: boolean = false;

  /**
   * Current user
   * @type {ReplaySubject<User>}
   */
  private currentUser$: ReplaySubject<User> = new ReplaySubject<User>(1);

  /**
   * @ignore
   */
  constructor(private readonly userService: UserService, private readonly discourseService: DiscourseService) {}

  /**
   * Gets current user from API when state is empty or needs revalidate
   * @returns {Observable<User>}
   */
  getCurrentUser(): Observable<User> {
    return defer(() => {
      this.userService.getToken();
      if (this.currentUser && this.currentUser.attributes.email !== this.userService.getTokenData().user.email) {
        this.clearCurrentUser();
      }
      if (!this.currentUser && !this.isFetching) {
        this.isFetching = true;
        this.userService
          .getCurrentUser()
          .pipe(take(1))
          .subscribe(
            user => {
              this.isFetching = false;
              this.setCurrentUser(user);
            },
            () => {
              this.isFetching = false;
              this.clearCurrentUser();
            },
          );
      }
      return this.currentUser$.asObservable().pipe(filter(user => user !== null));
    });
  }

  /**
   * Sets current user
   * @param {User} user
   */
  setCurrentUser(user: User): void {
    this.discourseService.setDiscourseCredentials();
    const userCopy = Object.assign({}, user);
    this.currentUser = userCopy;
    this.currentUser$.next(userCopy);
  }

  /**
   * Clears current user
   */
  clearCurrentUser(): void {
    this.discourseService.clearDiscourseCredentials();
    this.currentUser = null;
    this.currentUser$.next(null);
  }
}

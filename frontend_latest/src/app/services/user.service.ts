import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';
import { ApiConfig } from '@app/services/api';
import { IRegistration, User } from '@app/services/models';
import { AuthRequestModel } from '@app/services/models/authRequestModel';
import { BasicPageParams } from '@app/services/models/page-params';
import { UserDashboardData } from '@app/services/models/user-dashboard-data';
import { RestService } from '@app/services/rest.service';
import { ArrayHelper } from '@app/shared/helpers';
import { Role } from '@app/shared/user-permissions/Role';

/**
 * Auth and user service. Handles API communication on user level.
 */
@Injectable()
export class UserService extends RestService {
  public redirectUrl: string;
  /**
   * Determines password min length
   */
  readonly passwordMinLength = 8;
  /**
   * Custom Validators - string helper name, error name returned by specified validator
   * Used also by Visual Password Validator
   */
  readonly passwordCustomValidators = [
    ['hasLowercase', 'noLowercase'],
    ['hasUppercase', 'noUppercase'],
    ['hasNumbers', 'noNumbers'],
    ['hasSpecialChars', 'noSpecialChars'],
  ];
  private userId: number;

  /**
   * Registers user.
   * @param {IRegistration} user
   * @returns {Observable<any>}
   */
  public registerUser(user: IRegistration): Observable<any> {
    this.headers = new HttpHeaders();
    const requestData = this.prepareAuthParameters(user);

    return this.post(ApiConfig.userRegistration, requestData);
  }

  /**
   * Ask API to send another confirmation email in case if previous one did not arrive.
   * @param {string} email
   * @returns {Observable<any>}
   */
  public resendConfirmationEmail(email: string): Observable<any> {
    this.headers = new HttpHeaders();
    const requestData = this.prepareAuthParameters({ email });

    return this.post(ApiConfig.userResendEmail, requestData);
  }

  /**
   * Send email verification request with specified token
   * @param {string} token
   * @returns {Observable<any>}
   */
  public verifyEmail(token: string): Observable<any> {
    this.headers = new HttpHeaders();
    const url = ApiConfig.userVerifyEmail + `/${token}`;
    return this.get(url);
  }

  /**
   * Asks API to send email with password reset link
   * @param {{email: string}} model
   * @returns {Observable<any>}
   */
  public forgotPass(model: { email: string }): Observable<any> {
    this.headers = new HttpHeaders();
    const requestData = this.prepareAuthParameters(model);

    return this.post(ApiConfig.userResetPass, requestData);
  }

  /**
   * Send new passwords with given reset pass token
   * @param {string} token
   * @param model
   * @returns {Observable<any>}
   */
  public resetPass(
    token: string,
    model: {
      new_password1: string;
      new_password2: string;
    },
  ): Observable<any> {
    this.headers = new HttpHeaders();
    const requestData = this.prepareAuthParameters(model);
    const url = ApiConfig.userResetPass + `/${token}`;

    return this.post(url, requestData);
  }

  /**
   * Login user request
   * On success, saves token in browser data and sets up headers for further requests
   * @param {string} email
   * @param {string} password
   * @param {boolean} remember
   * @returns {Observable<User>}
   */
  public login(email: string, password: string, remember: boolean = true): Observable<User> {
    this.headers = new HttpHeaders();
    const requestData = this.prepareAuthParameters({ email, password });

    return new Observable(observer => {
      this.post(ApiConfig.userLogin, requestData)
        .pipe(map(response => response.data))
        .subscribe(
          data => {
            this.loginService.next(true);
            this.userId = data.id;
            this.setToken(data.attributes.token, remember);
            this.setupHeaders(this.token);
            observer.next(data as User);
            observer.complete();
          },
          error => observer.error(error),
        );
    });
  }

  /**
   * Change passoword call for logged in user
   * @returns {Observable<any>}
   * @param model
   */
  public changePassword(model: { old_password: string; new_password1: string; new_password2: string }): Observable<any> {
    this.setupHeaders(this.token, true);
    const requestData = this.prepareAuthParameters({ ...model });

    return this.post(ApiConfig.userChangePass, requestData);
  }

  /**
   * Logs out user and clears any session tokens
   * @returns {Observable<any>}
   */
  public logout(): Observable<any> {
    return this.post(ApiConfig.userLogout).pipe(
      finalize(() => {
        this.clearToken();
        this.loginService.next(false);
      }),
    );
  }

  /**
   * Get user profile data
   * @returns {Observable<User>}
   */
  public getCurrentUser(): Observable<User> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('include', 'institution,agent_institution');

    return new Observable(observer => {
      this.get(ApiConfig.userProfile, httpParams)
        .pipe(
          map(response => {
            const user = {
              id: response.data.id,
              attributes: response.data.attributes,
            } as User;

            if (response.included) {
              let agentInstitutions = [];
              let institutionsArr = [];

              const { institutions, agent_institutions } = response.data.relationships;
              if (!!agent_institutions) {
                agentInstitutions = agent_institutions.data;
              }
              if (!!institutions) {
                institutionsArr = institutions.data;
              }

              user.agent_institutions = agentInstitutions.map(this.mapUserInstitutions(response));

              user.institutions = institutionsArr.map(this.mapUserInstitutions(response));
            }

            return user;
          }),
        )
        .subscribe(
          data => {
            this.userId = data.id;
            this.loginService.next(true);
            observer.next(data);
            observer.complete();
          },
          error => {
            this.loginService.next(false);
            observer.error(error);
          },
        );
    });
  }

  /**
   * Gets Csrf token from API when necessary
   * @returns {Observable<void>}
   */
  public getCsrfToken(): Observable<void> {
    if (this.cookieService.get(APP_CONFIG.csrfCookieName)) {
      return of();
    }
    return this.http.get(this.base_url + ApiConfig.userProfile).pipe(
      map(() => {
        return;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }

  public getWKData(token: string): Observable<any> {
    return this.http.get(ApiConfig.logingovpl, {params: {token}}).pipe(
      map(() => {
        return;
      }),
      catchError(() => {
        return of(null);
      })
    );

  }

  /**
   * Gets current user dashboard data
   * @returns {Observable<UserDashboardData>}
   */
  public getUserDashboardData(): Observable<UserDashboardData> {
    return this.get(ApiConfig.userDashboard).pipe(
      map(response => {
        return response.meta.aggregations as UserDashboardData;
      }),
    );
  }

  /**
   * Gets formats for the user
   */
  getFormats() {
    return this.get(ApiConfig.userFormats).pipe(
      map(response => {
        return response.data.map(format => {
          return {
            id: format.id,
            title: format.attributes.name,
          };
        });
      }),
    );
  }

  /**
   * Get activity of followed items
   * @param {string} objectType of items
   * @param {BasicPageParams} params
   * @returns {Observable<any>}
   */
  getFollowedObjectsActivity(objectType: string, params: BasicPageParams): Observable<any> {
    return new Observable<any>(subscriber => {
      params['object_name'] = objectType;

      this.get(ApiConfig.activityNotifications, new HttpParams({ fromObject: params })).subscribe(history => {
        subscriber.next(history);
        subscriber.complete();
      });
    });
  }

  /**
   * Set status for items as 'read'
   * @param {object} payload
   * @returns {Observable<any>}
   */
  setNotificationsStatusAsRead(payload: object): Observable<any> {
    return this.patch(ApiConfig.activityNotifications, payload);
  }

  /**
   * Toggle email notification consent
   * @param {object} payload
   * @returns {Observable<any>}
   */
  toggleEmailNotificationConsent(payload: object): Observable<any> {
    const requestData = this.prepareAuthParameters({ ...payload });

    return this.put(ApiConfig.userProfile, requestData).pipe(map(resp => resp.data));
  }

  /**
   * Determines whether user is logged in
   * @returns {boolean} true if valid
   */
  isLoggedIn(): boolean {
    return !!this.token;
  }

  /**
   * Determines whether user is in 'staff' role
   * @returns {boolean} true if valid
   * @deprecated since 'editor' and 'admin' role. Related to 'new_user_system_roles.be' flag
   */
  isStaff(): boolean {
    return this.isLoggedIn() && !!this.getTokenData().user.roles.find(role => role === 'staff');
  }

  /**
   * Determines whether user is in 'official' role
   * @returns {boolean} true if valid
   */
  isOfficial(): boolean {
    return this.isLoggedIn() && !!this.getTokenData().user.roles.find(role => role === 'official');
  }

  /**
   * Determines whether current logged in user has admin privileges
   * @returns {boolean} true if valid
   */
  isAdmin(): boolean {
    return (this.isLoggedIn() && !!this.getTokenData().user.roles.find(role => role === 'admin')) || this.isStaff();
  }

  /**
   * Determines whether current logged in user has editor privileges
   * @returns {boolean} true if valid
   */
  isEditor(): boolean {
    return (this.isLoggedIn() && !!this.getTokenData().user.roles.find(role => role === 'editor')) || this.isStaff();
  }

  /**
   * Checks if current user has required role
   * @param requiredRoles
   * @returns {boolean}
   */
  hasRequiredRole(requiredRoles: Array<Role>): boolean {
    if (requiredRoles.indexOf(Role.LOGGED_IN) !== -1) {
      return this.isLoggedIn();
    }

    if (!this.isLoggedIn()) {
      return false;
    }

    return this.validateRequiredRole(requiredRoles);
  }

  /**
   *
   * @param {T} model
   * @returns {AuthRequestModel<T>}
   */
  prepareAuthParameters<T>(model: T): AuthRequestModel<T> {
    return {
      data: {
        attributes: model,
        type: 'user',
      },
    };
  }

  /**
   * Returns role with highest priority
   * @param roles
   * @returns {Role | null}
   */
  getRoleWithHighestPriority(roles: Array<Role>): Role | null {
    const rolesPriority = [Role.ADMIN, Role.REPRESENTATIVE, Role.EDITOR, Role.OFFICIAL];
    const rolesMap = this.convertRolesToMap(roles);
    for (let i = 0; i < rolesPriority.length; i++) {
      const role = rolesMap[rolesPriority[i]];
      if (role) {
        return role;
      }
    }
    return null;
  }

  /**
   * Checks if required roles and user roles has more then one duplicate
   * @param userRoles
   * @param requiredRoles
   * @returns {boolean}
   */
  isMoreThenOneDuplicatedRoles(userRoles: Array<Role>, requiredRoles: Array<Role>): boolean {
    return ArrayHelper.checkIfMoreThenOneDuplicate(userRoles, requiredRoles);
  }

  /**
   * Validates if user has required role when user has more then one role
   * @param userRoles
   * @param requiredRoles
   */
  validateMultipleRoles(userRoles: Array<Role>, requiredRoles: Array<Role>) {
    const currentUserRolesMap = this.convertRolesToMap(userRoles);
    for (let i = 0; i < requiredRoles.length; i++) {
      const role = currentUserRolesMap[requiredRoles[i]];
      if (role) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set up headers for user calls, that have different data format
   * @param {string} token
   * @param {boolean} isJSON
   */
  protected setupHeaders(token: string, isJSON: boolean = false) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + token);
    if (!isJSON) {
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    } else {
      headers = headers.append('Content-Type', 'application/json');
    }

    this.headers = headers;
  }

  /**
   * Maps user institutions
   * @param response
   * @returns {(institution) => {id: any, title: any}}
   */
  private mapUserInstitutions(response) {
    return institution => {
      const includedInstitution = response.included.find(item => item.id === institution.id);

      return {
        id: institution.id,
        title: includedInstitution.attributes.title,
      };
    };
  }

  /**
   * Validates if current user has required role
   * When user has multiple roles picks this with heights priority and validate
   * @param requiredRoles
   * @private
   */
  private validateRequiredRole(requiredRoles: Array<Role>): boolean {
    const userRoles: Array<Role> = this.getTokenData().user.roles as Array<Role>;

    if (userRoles.length === 1) {
      return requiredRoles.indexOf(userRoles[0] as Role) !== -1;
    }

    if (this.isMoreThenOneDuplicatedRoles(userRoles, requiredRoles)) {
      return requiredRoles.indexOf(this.getRoleWithHighestPriority(userRoles)) !== -1;
    } else {
      return this.validateMultipleRoles(userRoles, requiredRoles);
    }
  }

  /**
   * Converts roles array to map
   * @param roles
   * @returns {{}}
   */
  private convertRolesToMap(roles: Array<string>): { [key: string]: Role } {
    const userRolesMap = {};
    roles.forEach(userRole => (userRolesMap[userRole] = userRole));
    return userRolesMap;
  }
}

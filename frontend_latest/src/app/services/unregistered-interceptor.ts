import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginService } from '@app/services/login-service';
import { HttpCustomErrorResponse } from '@app/services/models';
import { NotificationsService } from '@app/services/notifications.service';
import { UserStateService } from '@app/services/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class UnregisteredInterceptor implements HttpInterceptor {
  constructor(
    private notificationsService: NotificationsService,
    private userStateService: UserStateService,
    private loginService: LoginService,
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpCustomErrorResponse) => {
        if (err.status === 401) {
          return this.unauthorizedErrorHandler(err);
        }
        return throwError(err);
      }),
    );
  }

  private unauthorizedErrorHandler(err: HttpCustomErrorResponse) {
    this.userStateService.clearCurrentUser();
    this.loginService.next(false);
    this.notificationsService.clearAlerts();
    const redirect = this.router.parseUrl(this.router.url).queryParams.redirect;
    // handle error from WK integration, invalid link, switch account etc
    const logingovpl = this.router.parseUrl(this.router.url).queryParams.logingovpl;

    this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as [], {
      queryParams: {
        redirect: redirect,
        logingovpl: logingovpl
      }
    });

    return throwError(err);
  }
}

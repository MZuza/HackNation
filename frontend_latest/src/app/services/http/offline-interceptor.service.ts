import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { HttpCustomErrorResponse } from '@app/services/models';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Offline interceptor Interceptor
 */
@Injectable({
  providedIn: 'root',
})
export class OfflineInterceptorService implements HttpInterceptor {
  /**
   * @ignore
   */
  constructor(
    private notificationsService: NotificationsService,
    private featureFlagService: FeatureFlagService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  /**
   * Intercepts request to check if navigator is offline
   * @param request
   * @param next
   * @returns {Observable<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpCustomErrorResponse) => {
        if (err.status === 504 || (isPlatformBrowser(this.platformId) && !navigator.onLine)) {
          this.offlineErrorHandler();
        }
        return throwError(err);
      }),
    );
  }

  /**
   * Handles request when navigator is offline
   */
  private offlineErrorHandler() {
    if (!this.featureFlagService.validateFlagSync('S20_pwa.fe')) {
      return;
    }
    this.notificationsService.clearAlerts();
    this.notificationsService.addError('Nie udało się pobrać danych z serwera, upewnij się że masz połączenie z internetem.');
  }
}

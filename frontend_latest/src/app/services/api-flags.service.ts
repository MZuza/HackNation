import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';

/**
 * Api Flag Service
 */
@Injectable({
  providedIn: 'root',
})
export class ApiFlagsService {
  /**
   * @ignore
   */
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {}

  /**
   * Returns Feature Flags
   * @returns {Observable<any[] | any>}
   */
  getFeatureFlags(): Observable<any[] | any> {
    return this.http.get(APP_CONFIG.urls.flags.features).pipe(
      map((val: any) => val.features),
      catchError(err => {
        console.warn('Could not load feature flags: ', err);
        return of([]);
      }),
    );
  }

  /**
   * Registers flags client
   * @param subject
   * @returns {Observable<any[] | Object>}
   */
  registerClient(subject): Observable<any[] | Object> {
    const payload = {
      appName: APP_CONFIG.name,
      instanceId: this.document.location.hostname,
      strategies: ['default', 'environmentName', 'applicationHostname'],
      started: new Date(),
      interval: 0,
    };

    return this.http.post(APP_CONFIG.urls.flags.register, payload).pipe(
      catchError(err => {
        console.warn('Could not register Unleash client: ', err);
        return of([]);
      }),
      finalize(() => this.getFeatureFlags().subscribe(subject)),
    );
  }
}

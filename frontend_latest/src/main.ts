import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  PLATFORM_ID,
  provideZoneChangeDetection,
  TransferState
} from '@angular/core';
import { bootstrapApplication, BrowserModule, provideClientHydration, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { provideNgxLocalstorage } from 'ngx-localstorage';
import { MATOMO_CONFIGURATION } from 'ngx-matomo-client';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { flagsFactory, HttpLoaderFactory, matomoConfigFactory } from '@app/app.module';
import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { AbstractService } from '@app/services/abstract.service';
import { ApplicationsService } from '@app/services/applications.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { HomepageInterceptorService } from '@app/services/homepage-interceptor.service';
import { CacheInterceptor } from '@app/services/http/cache.interceptor';
import { OfflineInterceptorService } from '@app/services/http/offline-interceptor.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { LeafletService } from '@app/services/leflet.service';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { CookieExtractor } from '@app/services/security/cookie-extractor.service';
import { HttpXsrfInterceptorService } from '@app/services/security/http-xsrf-interceptor.service';
import { SeoService } from '@app/services/seo.service';
import { UnregisteredInterceptor } from '@app/services/unregistered-interceptor';
import { UserService } from '@app/services/user.service';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';
import { AuthGuard } from '@app/user/auth/auth.guard';

if (environment.production) {
  enableProdMode();
} else {
  console.log('Development mode');
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      Title,
      AuthGuard,
      CookieService,
      CookieExtractor,
      LanguageBootstrapService,
      FooterLogosFilterService,
      NotificationsService,
      UserService,
      LocalizeRouterService,
      BsModalService,
      SeoService,
      AbstractService,
      ApplicationsService,
      ObserveService,
      InstitutionsService,
      NotificationsFrontService,
      { provide: HTTP_INTERCEPTORS, useClass: UnregisteredInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptorService, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: HomepageInterceptorService, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptorService, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
      {
        provide: APP_INITIALIZER,
        useFactory: flagsFactory,
        deps: [FeatureFlagService],
        multi: true,
      },
      {
        provide: Sentry.TraceService,
        deps: [Router],
      },
      {
        provide: MATOMO_CONFIGURATION,
        useFactory: matomoConfigFactory,
        deps: [PLATFORM_ID],
      },
      provideCharts(withDefaultRegisterables()),
      provideNgxLocalstorage({
        prefix: 'mcod'
      }),
      provideZoneChangeDetection({ eventCoalescing: true }),
      importProvidersFrom(
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.PWA }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, TransferState]
            },
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        })),
        LeafletService,
        TourService,
        TourDataService,
    ]
})
    .catch(err => console.error(err));
});

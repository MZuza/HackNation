import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CookieExtractor } from '@app/services/security/cookie-extractor.service';
import { HttpXsrfInterceptorService } from '@app/services/security/http-xsrf-interceptor.service';

@NgModule()
export class HttpXsrfModule {
  static forRoot(): ModuleWithProviders<HttpXsrfModule> {
    return {
      ngModule: HttpXsrfModule,
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptorService, multi: true }, CookieExtractor],
    };
  }
}

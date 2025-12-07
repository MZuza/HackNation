import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestModuleMetadata } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { provideNgxLocalstorage } from 'ngx-localstorage';

import { NotificationsService } from '@app/services/notifications.service';

export class ServiceTestbed {
  static module(forService): TestModuleMetadata {
    return {
      imports: [TranslateModule.forRoot()],
      providers: [
        forService,
        NotificationsService,
        CookieService,
        provideNgxLocalstorage({
          prefix: 'mcod'
        }),
        provideHttpClientTesting(),
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi())
      ],
    };
  }
}

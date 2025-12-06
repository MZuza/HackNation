import { DOCUMENT } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from '@app/app.config';
import { CookieExtractor } from '@app/services/security/cookie-extractor.service';
import { HttpXsrfInterceptorService } from '@app/services/security/http-xsrf-interceptor.service';

@Injectable()
class HttpXsrfInterceptorServiceMock extends HttpXsrfInterceptorService {
  protected isProductionEnv(): boolean {
    return true;
  }
}

describe('HttpXsrfInterceptorService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const token = 'KC2oOsDXAcL6yjePGvK9l6zHLPH8C072UR4yUcTD6auAFnX2kw7tIzG1VuJaS87O';
  const testUrl = 'https://api.dev.dane.gov.pl/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptorServiceMock, multi: true },
        CookieExtractor,
        {
          provide: DOCUMENT,
          useValue: {
            cookie: `${APP_CONFIG.csrfCookieName}=${token};`,
            location: { protocol: 'https:', hostname: 'dev.dane.gov.pl' },
            querySelectorAll: () => []
          },
        },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should applies XSRF protection to outgoing API POST requests', () => {
    httpClient.post<any>(testUrl, {}).subscribe();
    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.headers.get(APP_CONFIG.csrfToken)).toEqual(token);
    req.flush({});
  });

  it('should not applies XSRF protection to outgoing API GET requests', () => {
    httpClient.get<any>(testUrl).subscribe();
    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.headers.get(APP_CONFIG.csrfToken)).toBeNull();
    req.flush({});
  });

  it('should not applies XSRF protection to outgoing POST requests to other endpoint then API', () => {
    const cmsURL = 'https://cms.dev.dane.gov.pl/';
    httpClient.post<any>(cmsURL, {}).subscribe();
    const req = httpTestingController.expectOne(cmsURL);
    expect(req.request.headers.get(APP_CONFIG.csrfToken)).toBeNull();
    req.flush({});
  });
});

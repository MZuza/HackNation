import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

class LocalStorageServiceStub {}

describe('TourDataService', () => {
  let service: TourDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        TourDataService,
        NotificationsService,
        CookieService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });

    service = TestBed.inject(TourDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetches tours from api', () => {
    service.getTourById('1').subscribe(value => {
      expect(value).toBe([{ name: '', id: '1', items: [] }]);
    });
  });

  it('should gets tour for route', () => {
    service.getTourForRoute('').subscribe(value => {
      expect(value).toBe([{ name: '', id: '', items: [] }]);
    });
  });

  it('should gets routes where tour button should be visible', () => {
    service.getRoutesWhereTourShouldButtonVisible().subscribe(value => {
      expect(value).toBe({});
    });
  });
});

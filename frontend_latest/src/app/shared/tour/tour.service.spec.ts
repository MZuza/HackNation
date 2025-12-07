import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ShepherdService } from 'angular-shepherd';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

import { NotificationsService } from '@app/services/notifications.service';
import { Tour } from '@app/shared/tour/Tour';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';

class LocalStorageServiceStub {
  set() {}
}
class ShepherdServiceStub {
  tourObject: {} = { on: jest.fn() };
  addSteps() {}
  start() {}
}

describe('TourService', () => {
  let service: TourService;
  let httpMock: HttpTestingController;
  let serviceShepherd: ShepherdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        TourService,
        NotificationsService,
        CookieService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        TourDataService,
        { provide: ShepherdService, useClass: ShepherdServiceStub },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TourService);
    serviceShepherd = TestBed.inject(ShepherdService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should starts tour', () => {
    const tour: Tour = {
      name: 'test',
      id: '1',
      items: [],
    };
    jest.spyOn(serviceShepherd, 'addSteps');
    jest.spyOn(serviceShepherd, 'start');
    service.startTour(tour);
    expect(serviceShepherd.defaultStepOptions).toStrictEqual({});
  });

  it('should gets current tour', () => {
    service.getCurrentTour().subscribe(value => {
      expect(value).toBe({});
    });
  });

  it('should pauses tour', () => {
    const tour: Tour = {
      name: 'test',
      id: '1',
      items: [],
      progress: {tourId: '1', currentStepIndex: 1, currentStepRoute: '2'},
    };
    jest.spyOn(LocalStorageService.prototype, 'set');
    service.pauseTour(tour);
    expect(tour.progress).toBeTruthy();
  });

  it('should cleanups', () => {
    service.ngOnDestroy();
  });
});

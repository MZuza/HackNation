import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NotificationsService } from './notifications.service';

class TranslateServiceStub {
  get = jest.fn().mockImplementation((key: string | Array<string>, interpolateParams?: Object) => of(''));
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService, { provide: TranslateService, useClass: TranslateServiceStub }],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addSuccess function', () => {
    const spyFunction = jest.spyOn(service, 'addSuccess');
    service.addSuccess('success');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call addAlertWithTranslation function', () => {
    const spyFunction = jest.spyOn(service, 'addAlertWithTranslation');
    service.addAlertWithTranslation('type', 'key');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call addError function', () => {
    const spyFunction = jest.spyOn(service, 'addError');
    service.addError('error');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call addAlert function', () => {
    const spyFunction = jest.spyOn(service, 'addAlert');
    service.addAlert('alert', 'test');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call clearAlerts function', () => {
    const spyFunction = jest.spyOn(service, 'clearAlerts');
    service.clearAlerts();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call getAlerts function', () => {
    const spyFunction = jest.spyOn(service, 'getAlerts');
    service.getAlerts();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('getAlerts - Observable should add value', async () => {
    service.getAlerts().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should call shortcut for new success message', () => {
    const spyFunction = jest.spyOn(service, 'addAlert');
    service.addSuccess('test');
    expect(spyFunction).toHaveBeenCalled();
  });
});

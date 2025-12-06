import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { ScheduleNotificationsService } from './schedule-notifications.service';

describe('ScheduleNotificationsService', () => {
  let service: ScheduleNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ScheduleNotificationsService));

    service = TestBed.inject(ScheduleNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call sendNotification function', () => {
    const notification = {
      message: 'message',
      type: 'type',
    };

    expect(service.sendNotification(notification)).toBeTruthy();
  });

  it('should call removeById function', () => {
    expect(service.removeById(1)).toBeTruthy();
  });

  it('should call getRecipientTypes function', () => {
    const spyFunction = jest.spyOn(service, 'getRecipientTypes');
    service.getRecipientTypes();

    expect(spyFunction).toBeCalled();
  });

  it('should sendNotification function return value', () => {
    const notification = {
      message: 'message',
      type: 'type',
    };

    service.sendNotification(notification).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should removeById function return value', () => {
    service.removeById(1).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should getRecipientTypes function return value', () => {
    const spyFunction = jest.spyOn(service, 'getRecipientTypes');
    service.getRecipientTypes();
    const mockResults = spyFunction.mock.results[0].value;
    const res = [
      { name: 'wszystkich', value: 'all' },
      { name: 'spóźnionych', value: 'late' },
    ];

    expect(mockResults).toEqual(res);
  });
});

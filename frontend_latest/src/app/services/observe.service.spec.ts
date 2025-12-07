import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ObserveService } from './observe.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('ObserveService', () => {
  let service: ObserveService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ObserveService));

    service = TestBed.inject(ObserveService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addSubscription function', () => {
    expect(service.addSubscription('test', '2', 'test', 2)).toBeTruthy();
  });

  it('should call removeSubscription function', () => {
    expect(service.removeSubscription(2)).toBeTruthy();
  });

  it('should call getSubscriptions function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.getSubscriptions('test', params)).toBeTruthy();
  });

  it('should call getNewNotifications function', () => {
    expect(service.getNewNotifications()).toBeTruthy();
  });

  it('should call markAllAsRead function', () => {
    expect(service.markAllAsRead()).toBeTruthy();
  });

  it('addSubscription - Observable should return value', async () => {
    service.addSubscription('test', '1', 'test', 2).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('removeSubscription - Observable should return value', async () => {
    service.removeSubscription(1).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getSubscriptions - Observable should return value', async () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.getSubscriptions('test', params).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getNewNotifications - Observable should return value', async () => {
    service.getNewNotifications().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

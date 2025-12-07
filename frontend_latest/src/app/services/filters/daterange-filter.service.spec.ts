import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { DaterangeFilterService } from './daterange-filter.service';

describe('DaterangeFilterService', () => {
  let service: DaterangeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(DaterangeFilterService));

    service = TestBed.inject(DaterangeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call changeDaterange function', () => {
    const spyFunction = jest.spyOn(service, 'changeDaterange');
    const daterangeFilterUpdated = {
      name: '',
      value: new Date(),
    };
    service.changeDaterange([daterangeFilterUpdated]);

    expect(spyFunction).toBeCalled();
  });

  it('should call getAvailability function', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    service.getAvailability({ value: new Date() }, {});

    expect(spyFunction).toBeCalled();
  });

  it('should changeDaterange function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeDaterange');
    const daterangeFilterUpdated = {
      name: 'nazwa_testowa',
      value: new Date('August 19, 1975 23:15:30'),
    };
    service.changeDaterange([daterangeFilterUpdated]);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ nazwa_testowa: new Date('August 19, 1975 23:15:30') });
  });

  it('should getAvailability function return false value', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    const changedData = {
      name: new Date('August 19, 1975 23:15:30'),
    };
    const initialData = {
      name: new Date('August 19, 1975 23:15:30'),
    };
    service.getAvailability(changedData, initialData);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ name: false });
  });

  it('should getAvailability function return true value', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    const changedData = {
      name: new Date('August 20, 1975 12:15:30'),
    };
    const initialData = {
      name: new Date('August 19, 1975 23:15:30'),
    };
    service.getAvailability(changedData, initialData);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ name: true });
  });
});

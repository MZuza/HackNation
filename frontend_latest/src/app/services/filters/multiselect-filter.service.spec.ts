import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { MultiselectFilterService } from './multiselect-filter.service';

describe('MultiselectFilterService', () => {
  let service: MultiselectFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(MultiselectFilterService));

    service = TestBed.inject(MultiselectFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call changeMultiselect function', () => {
    const spyFunction = jest.spyOn(service, 'changeMultiselect');
    service.changeMultiselect({ id: 1 }, { id: '582897' });

    expect(spyFunction).toBeCalled();
  });

  it('should call changeSingleselect function', () => {
    const spyFunction = jest.spyOn(service, 'changeSingleselect');
    service.changeSingleselect({ region_id: '582897' });

    expect(spyFunction).toBeCalled();
  });

  it('should call getAvailability function', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    service.getAvailability({ id: 2 }, { id: 1 });

    expect(spyFunction).toBeCalled();
  });

  it('should changeMultiselect function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeMultiselect');
    service.changeMultiselect({ id: 1 }, { id: '582897' });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ id: 1, 582897: { id: '582897' } });
  });

  it('should changeSingleselect function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeSingleselect');
    service.changeSingleselect({ region_id: '582897' });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ 582897: { region_id: '582897' } });
  });

  it('should getAvailability function return false value', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    service.getAvailability({ id: 2 }, { id: 1 });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(false);
  });

  it('should getAvailability function return true value', () => {
    const spyFunction = jest.spyOn(service, 'getAvailability');
    service.getAvailability({ id: 2, doc_count: 4 }, { id: 1 });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(true);
  });
});

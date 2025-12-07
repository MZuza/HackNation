import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { ListViewManageFiltersService } from './list-view-manage-filters.service';

describe('ListViewManageFiltersService', () => {
  let service: ListViewManageFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ListViewManageFiltersService));

    service = TestBed.inject(ListViewManageFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call buildAvailibilityMap function', () => {
    const spyFunction = jest.spyOn(service, 'buildAvailibilityMap');
    const keys = ['jeden', 'dwa'];
    service.buildAvailibilityMap(keys);

    expect(spyFunction).toBeCalled();
  });

  it('should call prepareToApply function', () => {
    const spyFunction = jest.spyOn(service, 'prepareToApply');
    service.prepareToApply(['jeden', 'dwa'], { id: '582897' });

    expect(spyFunction).toBeCalled();
  });

  it('should call changeMultiselectFilter function', () => {
    const spyFunction = jest.spyOn(service, 'changeMultiselectFilter');
    const selectedIds = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    const selectedOption = {
      id: '582897',
      doc_count: 3,
      title: 'title',
      titleTranslationKey: 'translate',
    };
    service.changeMultiselectFilter(selectedIds, selectedOption);

    expect(spyFunction).toBeCalled();
  });

  it('should call changeSingleselectFilter function', () => {
    const spyFunction = jest.spyOn(service, 'changeSingleselectFilter');
    const selectedOption = {
      hierarchy_label: 'Polska',
      region_id: 582897,
      title: 'title',
      titleTranslationKey: 'translate',
      doc_count: 3,
    };
    service.changeSingleselectFilter(selectedOption);

    expect(spyFunction).toBeCalled();
  });

  it('should call checkIfMultiselectChanged function', () => {
    const spyFunction = jest.spyOn(service, 'checkIfMultiselectChanged');
    const changedData = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    const initialData = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    service.checkIfMultiselectChanged(changedData, initialData);

    expect(spyFunction).toBeCalled();
  });

  it('should call changeDaterangeFilter function', () => {
    const spyFunction = jest.spyOn(service, 'changeDaterangeFilter');
    const data = {
      name: '',
      value: new Date(),
    };
    service.changeDaterangeFilter([data]);

    expect(spyFunction).toBeCalled();
  });

  it('should call getDaterangeAvailability function', () => {
    const spyFunction = jest.spyOn(service, 'getDaterangeAvailability');
    const previousDaterange = {
      name: '',
      value: new Date(),
    };
    const newDaterange = {
      name: new Date('August 19, 1975 23:15:30'),
    };
    service.getDaterangeAvailability([previousDaterange], newDaterange, {});

    expect(spyFunction).toBeCalled();
  });

  it('should buildAvailibilityMap function return value', () => {
    const spyFunction = jest.spyOn(service, 'buildAvailibilityMap');
    const keys = ['jeden', 'dwa'];
    service.buildAvailibilityMap(keys);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ 0: false, 1: false });
  });

  it('should prepareToApply function return empty object', () => {
    const spyFunction = jest.spyOn(service, 'prepareToApply');
    service.prepareToApply(['jeden', 'dwa'], { id: '582897' });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({});
  });

  it('should prepareToApply function return object', () => {
    const spyFunction = jest.spyOn(service, 'prepareToApply');
    service.prepareToApply(['jeden', 'dwa'], { jeden: { id: '582897' } });
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ jeden: 'id' });
  });

  it('should changeMultiselectFilter function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeMultiselectFilter');
    const selectedIds = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    const selectedOption = {
      id: '582897',
      doc_count: 3,
      title: 'title',
      titleTranslationKey: 'translate',
    };
    const res = {
      582897: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    service.changeMultiselectFilter(selectedIds, selectedOption);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(res);
  });

  it('should changeSingleselectFilter function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeSingleselectFilter');
    const selectedOption = {
      hierarchy_label: 'Polska',
      region_id: 582897,
      title: 'title',
      titleTranslationKey: 'translate',
      doc_count: 3,
    };
    const res = {
      582897: {
        hierarchy_label: 'Polska',
        region_id: 582897,
        title: 'title',
        titleTranslationKey: 'translate',
        doc_count: 3,
      },
    };
    service.changeSingleselectFilter(selectedOption);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(res);
  });

  it('should checkIfMultiselectChanged function return false value', () => {
    const spyFunction = jest.spyOn(service, 'checkIfMultiselectChanged');
    const changedData = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    const initialData = {
      key: {
        id: '582897',
        doc_count: 3,
        title: 'title',
        titleTranslationKey: 'translate',
      },
    };
    service.checkIfMultiselectChanged(changedData, initialData);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(false);
  });

  it('should changeDaterangeFilter function return value', () => {
    const spyFunction = jest.spyOn(service, 'changeDaterangeFilter');
    const data = {
      name: 'nazwa_testowa',
      value: new Date('August 19, 1975 23:15:30'),
    };
    service.changeDaterangeFilter([data]);
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ nazwa_testowa: new Date('August 19, 1975 23:15:30') });
  });

  it('should getDaterangeAvailability function return true value', () => {
    const spyFunction = jest.spyOn(service, 'getDaterangeAvailability');
    const previousDaterange = {
      name: '',
      value: new Date('August 20, 1975 12:15:30'),
    };
    const initialData = {
      name: new Date('August 19, 1975 23:15:30'),
    };
    service.getDaterangeAvailability([previousDaterange], initialData, {});
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual({ name: true });
  });
});

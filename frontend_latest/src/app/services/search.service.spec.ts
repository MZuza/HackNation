import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

import { ApiResponse } from '@app/services/api';
import { AggregationOptionType } from '@app/services/models/filters';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SearchService));

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call search function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.search(params)).toBeTruthy();
  });

  it('should call getData function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.getData('https://test.pl', params)).toBeTruthy();
  });

  it('should call getFilters function', () => {
    expect(service.getFilters('https://test.pl', [])).toBeTruthy();
  });

  it('search - Observable should return value', async () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.search(params).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getData - Observable should return value', async () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.getData('https://test.pl', params).subscribe(value => {
      expect(value).toEqual(new ApiResponse(value));
    });
  });

  it('getFilters - Observable should return value', async () => {
    const listViewFilterAggregationsOptions = {
      [AggregationOptionType.CATEGORIES]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.INSTITUTION]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.FORMAT]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.OPENNESS_SCORE]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.VISUALIZATION_TYPE]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.LICENSES]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.UPDATE_FREQUENCY]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.TYPES]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.HIGH_VALUE_DATA]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.SHOWCASE_TYPE]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.SHOWCASE_CATEGORY]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.SHOWCASE_PLATFORMS]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.DYNAMIC_DATA]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.RESEARCH_DATA]: [
        {
          id: '',
          doc_count: 3,
          title: '',
          titleTranslationKey: '',
        },
      ],
      [AggregationOptionType.REGIONS]: [
        {
          bbox: [],
          hierarchy_label: '',
          region_id: 1,
          title: '',
          areaTranslationKey: '',
          doc_count: 3,
        },
      ],
    };

    service.getFilters('https://test.pl', []).subscribe(value => {
      expect(value).toEqual(listViewFilterAggregationsOptions);
    });
  });
});

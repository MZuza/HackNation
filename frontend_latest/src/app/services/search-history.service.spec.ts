import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiConfig } from '@app/services/api/api.config';
import { SearchHistoryService } from '@app/services/search-history.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

const responseMock = {
  meta: {
    count: 2,
  },
  data: [
    {
      type: 'searchhistory',
      attributes: {
        modified: '2021-03-15 07:48:47.210927+00:00',
        query_sentence: 'gdańsk',
        url: 'https://api.int.dane.gov.pl/1.4/search?page=1&per_page=20&q=gda%C5%84sk&sort=relevance',
        user: {
          id: '3',
        },
      },
      id: '4644',
      links: {
        self: 'https://api.int.dane.gov.pl/1.4/searchhistories/4644',
      },
    },
    {
      type: 'searchhistory',
      attributes: {
        modified: '2021-03-15 07:48:47.203671+00:00',
        query_sentence: 'warszawa',
        url: 'https://api.int.dane.gov.pl/1.4/search?sort=relevance&page=1&q=warszawa&per_page=20',
        user: {
          id: '3',
        },
      },
      id: '4643',
      links: {
        self: 'https://api.int.dane.gov.pl/1.4/searchhistories/4643',
      },
    },
  ],
};

describe('SearchHistoryService', () => {
  let service: SearchHistoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SearchHistoryService));

    service = TestBed.inject(SearchHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getGroupedSearchHistory without parameters', () => {
    service.getGroupedSearchHistory().subscribe(
      () => {
        const req = httpMock.expectOne(`/api${ApiConfig.searchHistory}?per_page=100&page=1&sort=-modified`);
        expect(req).toBeTruthy();
      }
    );

  });

  it('should return data grouped by date', () => {
    service.getGroupedSearchHistory().subscribe(data => {
      const req = httpMock.expectOne(`/api${ApiConfig.searchHistory}?per_page=100&page=1&sort=-modified`);
      req.flush(responseMock);
      expect(data).toEqual({
        '2021.03.15': [
          {
            params: {
              page: '1',
              per_page: '20',
              q: 'gdańsk',
              sort: 'relevance',
            },
            resource: 'search',
            sentence: 'gdańsk',
          },
          {
            params: {
              page: '1',
              per_page: '20',
              q: 'warszawa',
              sort: 'relevance',
            },
            resource: 'search',
            sentence: 'warszawa',
          },
        ],
      });
    });
  });
});

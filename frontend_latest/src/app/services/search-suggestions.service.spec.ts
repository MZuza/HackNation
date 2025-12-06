import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiModel } from '@app/services/api/api-model';
import { ApiConfig } from '@app/services/api/api.config';
import { SearchSuggestionsService } from '@app/services/search-suggestions.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

const responseMock = {
  data: [
    {
      attributes: {
        source: {
          title: 'CKAN Gdańsk',
          last_import_timestamp: '2021-03-16T03:00:02.574123+00:00',
          type: 'ckan',
          url: 'https://ckan.multimediagdansk.pl',
          update_frequency: 'codziennie',
        },
        modified: '2021-03-01T08:29:40.416502+00:00',
        data_date: '2021-03-01',
        notes: '2021/01 - raport',
        title: '2021/01 - raport',
        model: 'resource',
        visualization_types: [],
        slug: '202101-raport',
        verified: '2021-03-03T03:00:41.227669+00:00',
        created: '2021-03-01T08:29:21.528224+00:00',
      },
      relationships: {
        institution: {
          data: {
            type: 'institution',
            id: '154',
          },
          links: {
            related: 'https://api.dev.dane.gov.pl/1.4/institutions/154,gdanskie-centrum-informatyczne',
          },
        },
        dataset: {
          data: {
            type: 'dataset',
            id: '2437',
          },
          links: {
            related: 'https://api.dev.dane.gov.pl/1.4/datasets/2437,wifi-gdansk-2021',
          },
        },
      },
      links: {
        self: 'https://api.dev.dane.gov.pl/resources/19954,202101-raport',
      },
      type: 'common',
      id: 'resource-19954',
    },
    {
      attributes: {
        tags: ['struktura kształcenia', 'badania kosmiczne'],
        source: {},
        keywords: ['struktura kształcenia', 'badania kosmiczne'],
        category: {
          image_url: 'https://dev.dane.gov.pl/media/images/common/2015-05-18-152059.079726nauka-oswiata.png',
          description: '{}',
          title: 'Nauka i Oświata',
          id: '4',
        },
        modified: '2019-07-15T13:39:14.800415+00:00',
        notes: '<p>Raporty o stanie kształcenia na poziomie wyższym w obszarze badań kosmicznych i satelitarnych w Polsce</p>',
        title: 'Raporty o stanie kształcenia na poziomie wyższym w obszarze badań kosmicznych i satelitarnych w Polsce',
        model: 'dataset',
        visualization_types: [],
        image_alt: '',
        categories: [],
        slug: 'raporty-o-stanie-ksztacenia-na-poziomie-wyzszym-w-obszarze-badan-kosmicznych-i-satelitarnych-w-polsce',
        verified: '2020-07-22T05:20:03.582897+00:00',
        created: '2019-02-01T10:27:07.918023+00:00',
      },
      relationships: {
        institution: {
          data: {
            type: 'institution',
            id: '144',
          },
          links: {
            related: 'https://api.dev.dane.gov.pl/1.4/institutions/144,polska-agencja-kosmiczna',
          },
        },
      },
      links: {
        self: 'https://api.dev.dane.gov.pl/datasets/1432,raporty-o-stanie-ksztacenia-na-poziomie-wyzszym-w-obszarze-badan-kosmicznych-i-satelitarnych-w-polsce',
      },
      type: 'common',
      id: 'dataset-1432',
    },
  ],
  meta: {
    server_time: '2021-03-16T07:57:45Z',
    relative_uri: '/1.4/search/suggest?q=raport&models=dataset%2Cresource&per_model=1',
    aggregations: {},
    language: 'pl',
    path: '/1.4/search/suggest',
    params: {
      q: 'raport',
      models: 'dataset,resource',
      per_model: '1',
    },
    count: 2,
  },
  links: {
    self: 'https://api.dev.dane.gov.pl/1.4/search/suggest?per_model=1&q=raport&models=dataset%2Cresource&page=1',
  },
  jsonapi: {
    version: '1.0',
  },
};

describe('SearchSuggestionsService', () => {
  let service: SearchSuggestionsService;
  let httpMock: HttpTestingController;
  let httpParams: { q: string; models: string[]; per_model: number };

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SearchSuggestionsService));

    service = TestBed.inject(SearchSuggestionsService);
    httpMock = TestBed.inject(HttpTestingController);
    httpParams = {
      q: 'otwarte dane',
      models: [ApiModel.DATASET, ApiModel.RESOURCE],
      per_model: 1,
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSuggestions with parameters', () => {
    service.getSuggestions(httpParams.q, httpParams.models, httpParams.per_model).subscribe(() => {
      const req = httpMock.expectOne(
        `/api${ApiConfig.searchSuggest}?q=otwarte%20dane&models=${ApiModel.DATASET}%2C${ApiModel.RESOURCE}&per_model=${httpParams.per_model}`,
      );
      req.flush({});
    });
  });

  it('should call getSuggestions with parameters 2', () => {
    service.getSuggestions(httpParams.q, httpParams.models, httpParams.per_model).subscribe(() => {
      const req = httpMock.expectOne(
        `/api${ApiConfig.searchSuggest}?q=otwarte%20dane&models=${ApiModel.DATASET}%2C${ApiModel.RESOURCE}&per_model=${httpParams.per_model}`,
      );

      expect(req).toBeTruthy();
    });
  });

  it('should return suggestions for specified criteria', () => {
    service.getSuggestions('raport', [ApiModel.DATASET, ApiModel.RESOURCE], 1).subscribe(data => {
      const req = httpMock.expectOne(`/api${ApiConfig.searchSuggest}?q=raport&models=${ApiModel.DATASET}%2C${ApiModel.RESOURCE}&per_model=1`);
      req.flush(responseMock);
      expect(data).toEqual(responseMock);
    });
  });
});

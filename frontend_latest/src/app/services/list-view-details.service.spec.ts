import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiModel } from '@app/services/api/api-model';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

const items = [
  {
    type: 'type',
    attributes: {
      modified: '',
      tags: [],
      author: '',
      created: '',
      title: 'test',
      notes: '',
      slug: 'slug',
      verified: '',
      data_date: null,
      model: ApiModel.RESOURCE,
      category: {
        description: null,
        title: 'title',
        id: '4',
      },
    },
    relationships: {
      institution: null,
      dataset: {
        data: {
          type: 'type',
          id: '2',
        },
      },
    },
    id: '2',
    language: 'pl',
  },
];

describe('ListViewDetailsService', () => {
  let service: ListViewDetailsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ListViewDetailsService));

    service = TestBed.inject(ListViewDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extends items objects with translations and details to display on list for ApiModel.RESOURCE', () => {
    items[0].attributes.model = ApiModel.RESOURCE;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'resource',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [
          { data: null, dateFormat: 'D MMMM YYYY', isDate: true, language: undefined, titleTranslationKey: 'Attribute.DataDate' },
        ],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'Resources.Single',
        type: 'type',
        url: '../dataset/2/resource/2,slug',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });

  it('should extends items objects with translations and details to display on list for ApiModel.DATASET', () => {
    items[0].attributes.model = ApiModel.DATASET;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'dataset',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [{ data: '', isDate: true, titleTranslationKey: 'Attribute.UpdateDate' }],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'Datasets.Single',
        type: 'type',
        url: '../dataset/2,slug',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });

  it('should extends items objects with translations and details to display on list for ApiModel.INSTITUTION', () => {
    items[0].attributes.model = ApiModel.INSTITUTION;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'institution',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [{ data: '', isDate: true, titleTranslationKey: 'Attribute.CreationDate' }],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'Institutions.Single',
        type: 'type',
        url: '../institution/2, slug',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });

  it('should extends items objects with translations and details to display on list for ApiModel.KNOWLEDGE_BASE', () => {
    items[0].attributes.model = ApiModel.KNOWLEDGE_BASE;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'knowledge_base',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [{ data: '', isDate: true, titleTranslationKey: 'Attribute.AvailabilityDate' }],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'KnowledgeBase.Self',
        type: 'type',
        url: '../knowledgebase/useful-materials/slug/',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });

  it('should extends items objects with translations and details to display on list for ApiModel.SHOWCASE', () => {
    items[0].attributes.model = ApiModel.SHOWCASE;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'showcase',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [{ data: '', isDate: true, titleTranslationKey: 'Attribute.AvailabilityDate' }],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'Menu.Showcases',
        type: 'type',
        url: '../showcase/2,slug',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });

  it('should extends items objects with translations and details to display on list for ApiModel.NEWS', () => {
    items[0].attributes.model = ApiModel.NEWS;
    const result = [
      {
        attributes: {
          author: '',
          category: { description: null, id: '4', title: 'title' },
          created: '',
          data_date: null,
          model: 'news',
          modified: '',
          notes: '',
          slug: 'slug',
          tags: [],
          title: 'test',
          verified: '',
        },
        detailsData: [{ data: '', isDate: true, titleTranslationKey: 'Attribute.AvailabilityDate' }],
        id: '2',
        language: 'pl',
        relationships: {
          dataset: { data: { id: '2', type: 'type' } },
          institution: null,
        },
        titleTranslationKey: 'KnowledgeBase.News',
        type: 'type',
        url: '../article/slug',
      },
    ];
    expect(service.extendViewDetails(items)).toEqual(result);
  });
});

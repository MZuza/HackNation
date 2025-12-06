import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CmsService } from './cms.service';

import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('CmsService', () => {
  let service: CmsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(CmsService));

    service = TestBed.inject(CmsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get function', () => {
    expect(service.get('https://test.pl')).toBeTruthy();
  });

  it('should call footerNavIsExist function', () => {
    expect(service.footerNavIsExist(true)).toBeFalsy();
  });

  it('should call getAllNewsWidgets function', () => {
    const params = {
      children_per_page: 5,
      children_page: 1,
      children_extra_fields: 'body,author',
      children_sort: 'relevance',
    };
    expect(service.getAllNewsWidgets(params)).toBeTruthy();
  });

  it('should call getNewsWidgets function', () => {
    expect(service.getNewsWidgets('1')).toBeTruthy();
  });

  it('should call getHomePageWidgets function', () => {
    expect(service.getHomePageWidgets()).toBeTruthy();
  });

  it('should call getImageMetaData function', () => {
    expect(service.getImageMetaData(1)).toBeTruthy();
  });

  it('should call getImage function', () => {
    expect(service.getImage('https://test.pl')).toBeTruthy();
  });

  it('should call addStyle function', () => {
    const widget = {
      general: {
        backgroundColor: undefined,
        classes: '',
        foregroundColor: undefined,
        margin: undefined,
        padding: undefined,
        style: '',
        textAlignment: '',
      },
      type: WidgetType.BANNER,
      id: '1',
      children: null,
      settings: null,
      classname: 'test',
    };
    expect(service.addStyle(widget)).toBeTruthy();
  });

  it('should not add css style', () => {
    const widget = {
      general: {
        backgroundColor: undefined,
        classes: '',
        foregroundColor: undefined,
        margin: undefined,
        padding: undefined,
        style: '',
        textAlignment: '',
      },
      type: WidgetType.BANNER,
      id: '1',
      children: null,
      settings: null,
      classname: 'test',
    };
    delete widget.general;
    expect(service.addStyle(widget)).toBeFalsy();
  });

  it('should set 0 to margin/padding string', () => {
    const widget = {
      general: {
        backgroundColor: undefined,
        classes: '',
        foregroundColor: undefined,
        margin: {
          unit: 'px',
          left: null,
          top: null,
          right: null,
          bottom: null,
        },
        padding: {
          unit: 'px',
          left: null,
          top: null,
          right: null,
          bottom: null,
        },
        style: '',
        textAlignment: '',
      },
      type: WidgetType.BANNER,
      id: '1',
      children: null,
      settings: null,
      classname: 'test',
    };
    expect(service.addStyle(widget)).toBeTruthy();
  });

  it('should call getLandingPage function', () => {
    expect(service.getLandingPage('https://test.pl')).toBeTruthy();
  });

  it('should call getSimplePage function', () => {
    expect(service.getSimplePage('https://test.pl')).toBeTruthy();
  });

  it('should call getForms function', () => {
    expect(service.getForms('https://test.pl')).toBeTruthy();
  });

  it('should call sendForm function', () => {
    expect(service.sendForm('https://test.pl', {})).toBeTruthy();
  });

  it('should call displayCmsErrorMessage function', () => {
    expect(service.displayCmsErrorMessage('https://test.pl', 'test')).toBeFalsy();
  });

  it('should call getCredentials function', () => {
    expect(service.getCredentials()).toBeTruthy();
  });

  it('get - Observable should return value', async () => {
    service.get('https://test.pl').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getAllNewsWidgets - Observable should return value', async () => {
    const params = {
      children_per_page: 5,
      children_page: 1,
      children_extra_fields: 'body,author',
      children_sort: 'relevance',
    };
    service.getAllNewsWidgets(params).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getNewsWidgets - Observable should return value', async () => {
    service.getNewsWidgets('22').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getHomePageWidgets - Observable should return value', async () => {
    service.getHomePageWidgets().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getImageMetaData - Observable should return value', async () => {
    service.getImageMetaData(22).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getLandingPage - Observable should return value', async () => {
    const iPageCms = {
      id: 22,
      meta: {},
      title: 'title',
      url_path: 'http://example.com',
      last_published_at: '',
      latest_revision_created_at: '',
      background_image: null,
      background_color: '',
      background_paralax: false,
      body: {
        blocks: [],
      },
    };
    service.getLandingPage('https://test.pl').subscribe(value => {
      expect(value).toEqual(iPageCms);
    });
  });

  it('getSimplePage - Observable should return value', async () => {
    const iPageCms = {
      id: 22,
      meta: {},
      title: 'title',
      url_path: 'http://example.com',
      last_published_at: '',
      latest_revision_created_at: '',
      background_image: null,
      background_color: '',
      background_paralax: false,
      body: {
        blocks: [],
      },
    };
    service.getSimplePage('https://test.pl').subscribe(value => {
      expect(value).toEqual(iPageCms);
    });
  });

  it('getForms - Observable should return value', async () => {
    const iCmsForms = {
      id: 22,
      meta: {},
      title: 'title',
      last_published_at: '',
      latest_revision_created_at: '',
      intro: '',
      thank_you_text: '',
      formsets: [],
      formsetObjects: [],
    };
    service.getForms('https://test.pl').subscribe(value => {
      expect(value).toEqual(iCmsForms);
    });
  });

  it('sendForm - Observable should return value', async () => {
    service.sendForm('https://test.pl', {}).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('footerNavIsExist should return value', () => {
    const isVisible = true;
    expect(service.footerNavIsExist(true)).not.toEqual(isVisible);
  });

  // it('getCredentials should return value', () => {
  //   expect(service.getCredentials()).toEqual({ withCredentials: true });
  // });

  it('should gets hostname', () => {
    service.getHostName();
  });
});

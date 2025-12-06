import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DatasetService } from './dataset.service';

import { ApiResponse } from '@app/services/api';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('DatasetService', () => {
  let service: DatasetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(DatasetService));

    service = TestBed.inject(DatasetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getOneById function', () => {
    expect(service.getOneById('1')).toBeTruthy();
  });

  it('should call getHistoryById function', () => {
    expect(service.getHistoryById('1')).toBeTruthy();
  });

  it('should call getResourcesList function', () => {
    expect(service.getResourcesList('1')).toBeTruthy();
  });

  it('should call getResourceById function', () => {
    expect(service.getResourceById('1')).toBeTruthy();
  });

  it('should call getResourceData function', () => {
    expect(service.getResourceData('1', {})).toBeTruthy();
  });

  it('should call sendDatasetFeedback function', () => {
    expect(service.sendDatasetFeedback('1', 'test')).toBeTruthy();
  });

  it('should call sendResourceFeedback function', () => {
    expect(service.sendResourceFeedback('1', 'test')).toBeTruthy();
  });

  it('should call sendSubmission function', () => {
    expect(service.sendSubmission('test')).toBeTruthy();
  });

  it('should call getSubmissions function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.getSubmissions(params)).toBeTruthy();
  });

  it('should call getSubmission function', () => {
    expect(service.getSubmission('1')).toBeTruthy();
  });

  it('should call sendSubmissionFeedback function', () => {
    expect(service.sendSubmissionFeedback('1', 'test')).toBeTruthy();
  });

  it('should call sendSubmissionFeedback function', () => {
    expect(service.sendSubmissionFeedback('1', 'test')).toBeTruthy();
  });

  it('should call getGeoData function', () => {
    expect(service.getGeoData('1')).toBeTruthy();
  });

  it('should call getResourceChartById function', () => {
    expect(service.getResourceChartById('1')).toBeTruthy();
  });

  it('should call updateResourceChart function', () => {
    const chartBlueprint = {
      chart_type: '',
      datasets: [],
      labels: '',
      sort: '',
    };
    expect(service.updateResourceChart('1', '1', chartBlueprint)).toBeTruthy();
  });

  it('should call saveResourceChart function', () => {
    const chartBlueprint = {
      chart_type: '',
      datasets: [],
      labels: '',
      sort: '',
    };
    expect(service.saveResourceChart('1', chartBlueprint)).toBeTruthy();
  });

  it('should call deleteResourceChart function', () => {
    expect(service.deleteResourceChart('1')).toBeTruthy();
  });

  it('should call getShowcasesList function', () => {
    expect(service.getShowcasesList('1')).toBeTruthy();
  });

  it('should call getDataFromBBox function', () => {
    expect(service.getDataFromBBox('1', 'date', '')).toBeTruthy();
  });

  it('getOneById - Observable should return value', async () => {
    service.getOneById('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getHistoryById - Observable should return value', async () => {
    service.getHistoryById('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getResourcesList - Observable should return value', async () => {
    service.getResourcesList('1').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value).toEqual(new ApiResponse(value));
    });
  });

  it('getResourceById - Observable should return value', async () => {
    service.getResourceById('1').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value.length).toBeGreaterThan(0);
    });

  });

  it('getResourceData - Observable should return value', async () => {
    service.getResourceData('1', {}).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('sendDatasetFeedback - Observable should return value', async () => {
    service.sendDatasetFeedback('1', 'test').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('sendResourceFeedback - Observable should return value', async () => {
    service.sendResourceFeedback('1', 'test').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('sendSubmission - Observable should return value', async () => {
    service.sendSubmission('test').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getSubmissions - Observable should return value', async () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.getSubmissions(params).subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value).toEqual(new ApiResponse(value));
    });
  });

  it('getSubmission - Observable should return value', async () => {
    service.getSubmission('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('sendSubmissionFeedback - Observable should return value', async () => {
    service.sendSubmissionFeedback('1', 'test').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getGeoData - Observable should return value', async () => {
    service.getGeoData('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should get geo data of resource with given id and filters', async () => {
    const filters = { noData: 'test', boundaryBox: '', shapesCount: '', distance: '', coordinates: { lat: 1, lng: 2 }, q: '' };
    service.getGeoData('1', filters).subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getResourceChartById - Observable should return value', async () => {
    service.getResourceChartById('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('updateResourceChart - Observable should return value', async () => {
    const chartBlueprint = {
      chart_type: '',
      datasets: [],
      labels: '',
      sort: '',
    };
    service.updateResourceChart('1', '1', chartBlueprint).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('saveResourceChart - Observable should return value', async () => {
    const chartBlueprint = {
      chart_type: '',
      datasets: [],
      labels: '',
      sort: '',
    };
    service.saveResourceChart('1', chartBlueprint).subscribe(value => {
      const req = httpMock.expectOne({ method: 'POST' });
      req.flush('Post');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('deleteResourceChart - Observable should return value', async () => {
    service.deleteResourceChart('1').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getShowcasesList - Observable should return value', async () => {
    service.getShowcasesList('1').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value).toEqual(new ApiResponse(value));
    });
  });

  it('getDataFromBBox - Observable should return value', async () => {
    service.getDataFromBBox('1', 'date', '').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should get list of dataset for boundary box with filters', async () => {
    const filters = [
      ['categories', { 142: { doc_count: 1, id: '142', title: 'Edukacja, kultura i sport' } }],
      ['has_high_value_data', { true: { doc_count: 9, id: 'true', title: 'Tak' } }],
      ['types', { api: { id: 'api', doc_count: 61, title: 'Api' } }],
    ];
    service.getDataFromBBox('1', 'date', '', filters).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should get list of dataset items from given filters in `params` variable', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.getAll(params).subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
    });
  });
});

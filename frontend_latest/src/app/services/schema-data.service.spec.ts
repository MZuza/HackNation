import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SchemaDataService } from './schema-data.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('SchemaDataService', () => {
  let service: SchemaDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SchemaDataService));

    service = TestBed.inject(SchemaDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDatasetStructuredData function', () => {
    expect(service.getDatasetStructuredData(1)).toBeTruthy();
  });

  it('should call getResourceStructuredData function', () => {
    expect(service.getResourceStructuredData(2, 1)).toBeTruthy();
  });

  it('getDatasetStructuredData - Observable should return value', async () => {
    service.getDatasetStructuredData(1).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getResourceStructuredData - Observable should return value', async () => {
    service.getResourceStructuredData(2, 1).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationsService } from './applications.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ApplicationsService));

    service = TestBed.inject(ApplicationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAll function', () => {
    expect(service.getAll({ has_image_thumb: true })).toBeTruthy();
  });

  it('should call getOne function', () => {
    expect(service.getOne('44')).toBeTruthy();
  });

  it('Observable should return value', async () => {
    service.getOne('44').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('Observable should return value', async () => {
    service.getAll({ has_image_thumb: true }).subscribe(value => {
      expect(value).toBeTruthy();
    });
  });

  it('should get related datasets for a given application item', async () => {
    service.getDatasets('1').subscribe(value => {
      expect(value).toBeTruthy();
    });
  });
});

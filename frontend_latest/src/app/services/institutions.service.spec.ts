import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InstitutionsService } from './institutions.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('InstitutionsService', () => {
  let service: InstitutionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(InstitutionsService));

    service = TestBed.inject(InstitutionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getOne function', () => {
    expect(service.getOne('44')).toBeTruthy();
  });

  it('Observable should return value', () => {
    service.getOne('44').subscribe(value => {
      const req = httpMock.expectOne({ method: 'GET' });
      req.flush('Get');
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

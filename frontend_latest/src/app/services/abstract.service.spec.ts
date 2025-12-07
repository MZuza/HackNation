import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractService } from './abstract.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('AbstractService', () => {
  let service: AbstractService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(AbstractService));
    service = TestBed.inject(AbstractService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRequest function', () => {
    expect(service.getRequest('https://test.url.pl')).toBeTruthy();
  });

  it('Observable should return value', async () => {
    service.getRequest('https://test.url.pl').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

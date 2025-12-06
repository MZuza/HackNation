import { TestBed } from '@angular/core/testing';
import { ApiFlagsService } from './api-flags.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('AbstractService', () => {
  let service: ApiFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ApiFlagsService));

    service = TestBed.inject(ApiFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getFeatureFlags function', () => {
    expect(service.getFeatureFlags()).toBeTruthy();
  });

  it('should call registerClient function', () => {
    expect(service.registerClient('test')).toBeTruthy();
  });

  it('Observable should return value', async () => {
    service.getFeatureFlags().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

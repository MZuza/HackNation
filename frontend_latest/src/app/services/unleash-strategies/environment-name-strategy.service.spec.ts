import { TestBed } from '@angular/core/testing';

import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { EnvironmentNameStrategyService } from '@app/services/unleash-strategies/environment-name-strategy.service';

describe('EnvironmentNameStrategyService', () => {
  let service: EnvironmentNameStrategyService;
  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(EnvironmentNameStrategyService));
    service = TestBed.inject(EnvironmentNameStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call validateStrategy function', () => {
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('localhost');

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should validateStrategy function returns true value', () => {
    service.envName = 'local';
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('local');
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(true);
  });

  it('should validateStrategy function returns false value', () => {
    service.envName = 'dane.gov.pl';
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('local');
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(false);
  });
});

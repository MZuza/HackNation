import { TestBed } from '@angular/core/testing';

import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { ApplicationHostnameStrategyService } from '@app/services/unleash-strategies/application-hostname-strategy.service';

describe('ApplicationHostnameStrategyService', () => {
  let service: ApplicationHostnameStrategyService;
  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ApplicationHostnameStrategyService));
    service = TestBed.inject(ApplicationHostnameStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call validateStrategy function', () => {
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('localhost');

    expect(spyFunction).toBeCalled();
  });

  it('should validateStrategy function returns true value', () => {
    service.hostname = 'localhost';
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('localhost');
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(true);
  });

  it('should validateStrategy function returns false value', () => {
    service.hostname = 'dane.gov.pl';
    const spyFunction = jest.spyOn(service, 'validateStrategy');
    service.validateStrategy('localhost');
    const mockResults = spyFunction.mock.results[0].value;

    expect(mockResults).toEqual(false);
  });
});

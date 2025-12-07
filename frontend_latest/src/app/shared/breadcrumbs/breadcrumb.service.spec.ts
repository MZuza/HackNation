import { TestBed } from '@angular/core/testing';

import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { BreadcrumbService } from '@app/shared/breadcrumbs/breadcrumb.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(BreadcrumbService));

    service = TestBed.inject(BreadcrumbService);
  });

  it('should create', async () => {
    expect(service).toBeDefined();
  });

  it('should call getBreadcrumbs function', async () => {
    service.getBreadcrumbs().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should call getReversedBreadcrumbsLabels function', async () => {
    service.getReversedBreadcrumbsLabels().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

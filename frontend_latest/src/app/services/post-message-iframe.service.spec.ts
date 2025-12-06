import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PostMessageIframeService } from '@app/services/post-message-iframe.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('PostMessageIframeService', () => {
  let service: PostMessageIframeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(PostMessageIframeService));

    service = TestBed.inject(PostMessageIframeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get message', () => {
    service.getMessages().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NewsletterService } from './newsletter.service';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('NewsletterService', () => {
  let service: NewsletterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(NewsletterService));

    service = TestBed.inject(NewsletterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addNewsletterSubscription function', () => {
    const newsletterRequest = {
      email: 'test@test.pl',
      personal_data_processing: false,
      personal_data_use: false,
    };
    expect(service.addNewsletterSubscription(newsletterRequest)).toBeTruthy();
  });

  it('should call removeNewsletterSubscription function', () => {
    expect(service.removeNewsletterSubscription('token')).toBeTruthy();
  });

  it('should call getNewsletterRegulations function', () => {
    expect(service.getNewsletterRegulations()).toBeTruthy();
  });

  it('should call confirmNewsletterSubscription function', () => {
    expect(service.confirmNewsletterSubscription('token')).toBeTruthy();
  });

  it('addNewsletterSubscription - Observable should return value', async () => {
    const newsletterRequest = {
      email: 'test@test.pl',
      personal_data_processing: false,
      personal_data_use: false,
    };
    service.addNewsletterSubscription(newsletterRequest).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('removeNewsletterSubscription - Observable should return value', async () => {
    service.removeNewsletterSubscription('token').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('getNewsletterRegulations - Observable should return value', async () => {
    service.getNewsletterRegulations().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('confirmNewsletterSubscription - Observable should return value', async () => {
    service.confirmNewsletterSubscription('token').subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should get error message', () => {
    const customError = new HttpErrorResponse({
      error: {
        jsonapi: {
          version: '',
        },
        errors: [{ id: '2', status: 'status', code: 'code', title: 'title', detail: 'tu jest treść testowa' }],
      },
      statusText: 'Bad request',
      status: 400,
    });
    expect(service.getNewsletterError(customError)).toEqual('tu jest treść testowa');
  });
});

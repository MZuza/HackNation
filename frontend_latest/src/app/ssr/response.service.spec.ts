import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppTestingModule } from '@app/app.testing.module';
import { RESPONSE, ResponseService } from '@app/ssr/response.service';


class MockResponse {
  status(code: number) {}
}

describe('Response service', () => {
  let service: ResponseService;
  let mockResponseService: MockResponse;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(AppTestingModule),
        { provide: RESPONSE, useClass: MockResponse },
        ResponseService
      ],
    });
    service = TestBed.inject(ResponseService);
    mockResponseService = TestBed.inject(RESPONSE);
  });

  it('should create ', () => {
    const statusMock = jest.spyOn(mockResponseService, 'status').mockImplementation(() => {});

    service.setStatusCode(200);

    expect(statusMock).toHaveBeenLastCalledWith(200);
  });
});

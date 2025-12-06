import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NominatimGeocodeService } from '@app/services/nominatim-geocode.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('NominatimGeocodeService', () => {
  let service: NominatimGeocodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(NominatimGeocodeService));

    service = TestBed.inject(NominatimGeocodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get geocode point', () => {
    const coordinates = { lat: 123, lng: 123 };
    service.geocodePoint(coordinates);
    expect(
      httpMock.expectNone(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`),
    ).toBeFalsy();
  });

  it('should search addresses', () => {
    const address = 'adres';
    service.searchAddress(address);
    expect(
      httpMock.expectNone(`https://nominatim.openstreetmap.org/search.php?format=geojson&q=${encodeURIComponent(address)}`),
    ).toBeFalsy();
  });
});

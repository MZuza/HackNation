import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';

import {ICoordinates, INominatimGeocodeResponse, INominatimSearchResponse} from '@app/services/models/map';

/**
 * Service that handles communication with external Nominatim API
 */
@Injectable({
    providedIn: 'root'
})

export class NominatimGeocodeService {

    nominatimService = 'https://nominatim.openstreetmap.org';

    constructor(
        protected http: HttpClient) {
    }

    geocodePoint(coordinates: ICoordinates) {
        return this.http.get<INominatimGeocodeResponse>(`${this.nominatimService}/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`);
    }

    searchAddress(address: string) {
        return this.http.get<INominatimSearchResponse>(
          `${this.nominatimService}/search.php?format=geojson&q=${encodeURIComponent(address)}`
        );
    }
}

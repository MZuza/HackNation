import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '@app/services/api';
import { RestService } from '@app/services/rest.service';

/**
 * Schema Data Service
 */
@Injectable({
    providedIn: 'root'
})
export class SchemaDataService extends RestService {

    /**
     * Gets dataset structured data
     * @param datasetId
     * @returns {Observable<any>}
     */
    getDatasetStructuredData(datasetId: number): Observable<any> {
        return this.get(`${ApiConfig.catalog}/dataset/${datasetId}`);
    }

    /**
     * Gets datasets structured data
     * @param datasetId
     * @param resourceId
     * @returns {Observable<any>}
     */
    getResourceStructuredData(datasetId: number, resourceId: number): Observable<any> {
        return this.get(`${ApiConfig.catalog}/dataset/${datasetId}/resource/${resourceId}`);
    }

    /**
     * Adds profile to param to get request
     * @param relativeUrl
     * @returns {Observable<any>}
     */
    protected get(relativeUrl: string): Observable<any> {
        const params = new HttpParams()
            .append('profile', 'schemaorg');
        return super.get(relativeUrl, params);
    }
}

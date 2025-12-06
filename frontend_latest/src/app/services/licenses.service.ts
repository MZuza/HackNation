import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfig } from '@app/services/api';
import { LicenseWithRules, ZeroLicense } from '@app/services/models/license';
import { RestService } from '@app/services/rest.service';
import { StringHelper } from '@app/shared/helpers/string.helper';

@Injectable()
export class LicensesService extends RestService {
  /**
   * Gets license from SSR API because of performance
   * @param licenseName
   * @returns {Observable<ZeroLicense | LicenseWithRules>}
   */
  getLicense(licenseName: string): Observable<ZeroLicense | LicenseWithRules> {
    return this.get(ApiConfig.licenses + `${StringHelper.trimEndAndRemoveSpaces(licenseName, 4)}`).pipe(
      map(response => response['data']['attributes']),
    );
  }
}

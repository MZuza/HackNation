import { HttpClient } from '@angular/common/http';
import { makeStateKey, StateKey, TransferState } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';

/**
 * Translate Browser Loader
 */
export class TranslateBrowserLoaderService implements TranslateLoader {
  constructor(private http: HttpClient, private transferState: TransferState) {}

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);

    if (data) {
      return of(data);
    }
    return new TranslateHttpLoader(this.http).getTranslation(lang);
  }
}

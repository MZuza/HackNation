
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { makeStateKey, StateKey, TransferState } from '@angular/core';

const fs = require('fs');
const path = require('path');

/**
 * Translate Universal Loader
 */
export class TranslateUniversalLoader implements TranslateLoader {
  private prefix = 'i18n';
  private suffix = '.json';

  constructor(private transferState: TransferState) {}

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
    return of(JSON.parse(fs.readFileSync(path.join(__dirname, '..', `assets/${this.prefix}/${lang}${this.suffix}`), 'utf8'))).pipe(
      tap(data => {
        this.transferState.set(key, data);
      }),
    );
  }
}

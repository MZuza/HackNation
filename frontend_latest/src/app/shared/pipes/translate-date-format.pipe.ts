import { Pipe, PipeTransform } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import moment from 'moment/min/moment-with-locales';
import { BehaviorSubject } from 'rxjs';

import { APP_CONFIG } from '@app/app.config';

/**
 * Translate Date Format Pipe
 * Formats and translates provided date.
 * Needs 'async' pipe to display value. No need to unsubscribe ('async' does it).
 * @example
 * {{ item.attributes.created | translateDateFormat | async }}
 */
@Pipe({
    name: 'translateDateFormat',
    pure: true,
    standalone: true,
})
export class TranslateDateFormatPipe implements PipeTransform {
  /**
   * @ignore
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transforms input value
   * @param {string} value
   * @param {string} format
   * @returns {string} transform
   */
  transform(value: string, format?: string): any {
    format = format ? format : APP_CONFIG.dateTime;

    const initialValue = moment(value).locale(this.translate.currentLang).format(format);
    const translatedDateSubject = new BehaviorSubject<string>(initialValue);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      const updatedValue = moment(value).locale(event.lang).format(format);
      translatedDateSubject.next(updatedValue);
    });

    return translatedDateSubject;
  }
}

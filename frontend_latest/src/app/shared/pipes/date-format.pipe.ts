import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment/min/moment-with-locales';

import { APP_CONFIG } from '@app/app.config';

/**
 * Date Format Pipe
 * Formats input timespan with the default date format
 * @example
 * {{ item.attributes.created | dateFormat }}
 */
@Pipe({
    name: 'dateFormat',
    pure: true,
    standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  /**
   * @ignore
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transforms input
   * @param {string} value
   * @returns {string} transform
   */
  transform(value: string): string {
    // TODO: Custom DateTime dateFormat helper
    const lang = this.translate.currentLang;
    moment.locale(lang);
    return moment(value).format('DD MMMM YYYY, HH:MM');
  }
}

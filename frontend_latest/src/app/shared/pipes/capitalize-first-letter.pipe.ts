import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from '../helpers/string.helper';

/**
 * Capitalize First Letter Pipe
 * Capitalizes first letter of a string
 */
@Pipe({
    name: 'capitalizeFirstLetter',
    standalone: true,
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  /**
   * Transforms input
   * @param {string} value
   * @returns {string}
   */
  transform(value: string): string {
    return StringHelper.capitalizeFirstLetter(value);
  }
}

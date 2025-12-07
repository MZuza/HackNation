import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncate Text Pipe.
 * Truncates given text after the closest space (adds '...') or special character.
 * Usage:
 *  value | truncateText:10
 * @example
 *  {{ 'lorem ipsum dolor' | truncateText:10 }}
 */
@Pipe({
    name: 'truncateText',
    standalone: true,
})
export class TruncateTextPipe implements PipeTransform {
  /**
   * Transforms input value
   * @param {string} value
   * @param {number} limit
   * @returns {string}
   */
  transform(value: string, limit: number): string {
    if (limit >= value.length - 1) { return value; }

    const isSpecialChar: RegExp = /[\?.,:;_\-]/;
    const isSpace: RegExp = /\s/;
    const position: number = limit - 1;

    if (isSpace.test(value.charAt(position))) {
      if (isSpecialChar.test(value.charAt(position - 1))) {
        return value.substring(0, position);
      }

      return `${value.substring(0, position)}...`;
    } else {
      const spaceIndex = value.indexOf(' ', position);
      if (spaceIndex === -1) { return value; }

      if (isSpecialChar.test(value.charAt(spaceIndex - 1))) {
        return value.substring(0, spaceIndex);
      } else {
        return `${value.substring(0, spaceIndex)}...`;
      }
    }
  }
}

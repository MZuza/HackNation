import { Pipe, PipeTransform } from '@angular/core';

/**
 * Strip HTML Pipe
 * Strips out HTML angle brackets from a given text
 * @example
 * {{ item.description | stripHtml }}
 */
@Pipe({
    name: 'stripHtml',
    standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  /**
   * Transforms input value
   * @param {string} value
   * @returns {string}
   */
  transform(value: string): string {
    return value.replace(/(<([^>]+)>)/gi, '');
  }
}

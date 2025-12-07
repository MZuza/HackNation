import { Pipe, PipeTransform } from '@angular/core';

/**
 * Strip HTML with exception tags Pipe
 * Strips out HTML angle brackets from a given text
 * @example
 * {{ item.description | stripHtmlTagsExceptHighlight:'em' }}
 */
@Pipe({
    name: 'stripHtmlTagsExceptHighlight',
    standalone: true,
})
export class StripHtmlWithExceptionPipe implements PipeTransform {
  /**
   * Transforms input value
   * @param {string} value
   * @param exception
   * @returns {string}
   */
  transform(value: string, exception: string = 'mark'): string {
    const re = new RegExp(`<\/*?(?![^>]*?\\b(?:${exception})\\b)[^>]*?>`, 'ig');
    return value.replace(re, '');
  }
}

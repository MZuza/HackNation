import { Pipe, PipeTransform } from '@angular/core';

/**
 * Text To Links Pipe
 * Changes text to HTML anchors within a given text
 * @example
 *  {{ 'Some <a href="http://example.com">link</a> example' | textToLinks }}
 */
@Pipe({
    name: 'textToLinks',
    standalone: true,
})
export class TextToLinksPipe implements PipeTransform {
  /**
   * Transforms input value
   * @param {string} value
   * @returns {string}
   */
  transform(value: string): string {
    // http://, https:// or ftp://
    const protocolPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    // URLs starting with "www." - without // before it
    const wwwPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    //  email address to "mailto"
    const emailPattern = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;

    value = value.replace(protocolPattern, '<a href="$1" target="_blank">$1</a>');
    value = value.replace(wwwPattern, '$1<a href="http://$2" target="_blank">$2</a>');
    value = value.replace(emailPattern, '<a href="mailto:$1">$1</a>');

    return value;
  }
}

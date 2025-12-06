import { Pipe, PipeTransform } from '@angular/core';

/**
 * Inner Html text Pipe
 * Formats input string by adding to the end desired text
 * @example
 * [innerHTML]="item.attributes.source_title | innerHtmlAppend: ' >>'
 */
@Pipe({
    name: 'innerHtmlAppend',
    standalone: true,
})
export class InnerHtmlAppendPipe implements PipeTransform {
  transform(value: string, appendText: string): string {
    return value + appendText;
  }
}

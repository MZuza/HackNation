import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Sanitize HTML Pipe
 * Sanitizes HTML input against possible vulnerabilities
 * @example
 *  [innerHTML]="item.description | sanitizeHtml"
 */
@Pipe({
    name: 'sanitizeHtml',
    standalone: true,
})
export class SanitizeHtmlPipe implements PipeTransform {
  /**
   * @ignore
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Transforms input
   * @param {string} value
   * @returns {SafeHtml}
   */
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

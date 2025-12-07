import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeUrl',
    standalone: true,
})
export class SanitizeUrlPipe implements PipeTransform {
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
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationHostnameStrategyService {
  /**
   * Current hostname
   */
  hostname: string;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.hostname = this.document.location.hostname;
  }

  /**
   * Check if host names from flag strategy include current hostname
   * @param {string} hostNames
   * @return {boolean}
   */
  validateStrategy(hostNames: string): boolean {
    const names = hostNames.toLowerCase().split(',');
    return names.findIndex(el => el === this.hostname) >= 0;
  }
}

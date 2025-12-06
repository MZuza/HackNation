/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { DOCUMENT, isPlatformServer, ɵparseCookieValue } from '@angular/common';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { APP_CONFIG } from '@app/app.config';

@Injectable()
export class CookieExtractor implements HttpXsrfTokenExtractor {
  /**
   * Last cookie value
   * @type {string}
   */
  private lastCookieString: string = '';

  /**
   * Last parsed token
   * @type {string | null}
   */
  private lastToken: string | null = null;

  /**
   * Cookie parse count
   * @type {number}
   */
  private parseCount: number = 0;

  /**
   * @ignore
   */
  constructor(@Inject(DOCUMENT) private doc: Document, @Inject(PLATFORM_ID) private platform: string) {}

  /**
   * Gets token CSRF token from cookie
   * @returns {string | null}
   */
  getToken(): string | null {
    if (isPlatformServer(this.platform)) {
      return null;
    }
    const cookieString = this.doc.cookie || '';
    if (cookieString !== this.lastCookieString) {
      this.parseCount++;
      this.lastToken = ɵparseCookieValue(cookieString, APP_CONFIG.csrfCookieName);
      this.lastCookieString = cookieString;
    }
    return this.lastToken;
  }
}

/**
 * @licence
 * MIT License

 Copyright (c) 2020 Studytube BV

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Request, Response } from 'express';
export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

/**
 * Server Cookie Service
 */
@Injectable()
export class ServerCookieService {
  /**
   * Cookies
   * @type {string}
   */
  private readonly cookies: string;

  /**
   * @ignore
   */
  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(PLATFORM_ID) platformId: InjectionToken<object>,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(RESPONSE) private readonly response: Response,
  ) {
    // super(document, platformId);
    this.cookies = this.request.headers.cookies as string;
  }

  /**
   * Returns cookie RegExp
   * @param name Cookie name
   * @returns property RegExp
   */
  private static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');

    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }

  /**
   * Decodes string to URI Component
   * @param encodedURIComponent
   * @returns {string}
   */
  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }

  /**
   * Checks if cookie exists
   * @param name Cookie name
   * @returns boolean - whether cookie with specified name exists
   */
  check(name: string): boolean {
    name = encodeURIComponent(name);

    const regExp: RegExp = ServerCookieService.getCookieRegExp(name);
    const exists: boolean = regExp.test(this.cookies);

    return exists;
  }

  /**
   * Returns cookie value if exist
   * @param name Cookie name
   * @returns property value
   */
  get(name: string): string {
    if (this.check(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = ServerCookieService.getCookieRegExp(name);
      const result: RegExpExecArray = regExp.exec(this.cookies);

      return ServerCookieService.safeDecodeURIComponent(result[1]);
    } else {
      return '';
    }
  }


  /**
   * Sets cookie
   * @param name
   * @param value
   * @param options
   */
  set(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: 'Lax' | 'None' | 'Strict',
  ) {
    this.response.cookie(name, value, { domain, path, secure });
  }


}

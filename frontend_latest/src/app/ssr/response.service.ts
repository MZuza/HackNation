import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Response } from 'express';
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

/**
 * Response Service
 */
@Injectable()
export class ResponseService {
  /**
   * @ignore
   */
  constructor(@Inject(RESPONSE) private readonly response: Response) {}

  /**
   * Sets response status code
   * @param code
   */
  setStatusCode(code: number): void {
    this.response.status(code);
  }
}

import { HttpParameterCodec } from '@angular/common/http';

/**
 * Search Http Param Encoder
 */
export class SearchHttpParamEncoder implements HttpParameterCodec {
  /**
   * Encodes parameter key
   * @param key
   * @returns {string}
   */
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  /**
   * Encodes parameter value
   * @param value
   * @returns {string}
   */
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  /**
   * Decodes parameter key
   * @param key
   * @returns {string}
   */
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  /**
   * Decodes parameter value
   * @param value
   * @returns {string}
   */
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

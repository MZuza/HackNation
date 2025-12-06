import { StorageSerializer } from 'ngx-localstorage';

/**
 * Server Storage Service
 * Mocking browser local storage ond server
 */
export class ServerStorageService {
  /**
   *  Gets the number of entries in the applications local storage
   * @returns {number}
   */
  count(): number | undefined {
    return 0;
  }

  /**
   * Returns the nth (defined by the index parameter) key in the storage. The order of keys is user-agent defined, so you should not rely on it.
   * @param index
   * @returns {null}
   */
  getKey(index: number): string | null | undefined {
    return null;
  }

  /**
   * Adds tha value with the given key or updates an existing entry using either the provided or default serializer (check method overloads).
   * @param key
   * @param value
   * @param prefixOrSerializer
   * @returns {null}
   */
  set(key: string, value: any, prefixOrSerializer: string | StorageSerializer): void {
    return null;
  }

  /**
   * Gets the entry specified by the given key or null using either the provided or default serializer (check method overloads).
   * @param key
   * @param prefixOrSerializer
   * @returns {null}
   */
  get(key: string, prefixOrSerializer: string | StorageSerializer): any | null | undefined {
    return null;
  }

  /**
   * Removes the entry specified by the given key.
   * @param key
   * @param prefix
   * @returns {null}
   */
  remove(key: string, prefix?: string) {
    return null;
  }

  /**
   * Clears all entries of the applications local storage.
   */
  clear() {}
}

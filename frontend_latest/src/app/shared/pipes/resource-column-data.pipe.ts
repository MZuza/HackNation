import { Pipe, PipeTransform } from '@angular/core';

import { ResourceHelper } from '@app/shared/helpers/resource.helper';

/**
 * Resource Column Data Pipe
 */
@Pipe({
    name: 'resourceColumnData',
    standalone: true,
})
export class ResourceColumnDataPipe implements PipeTransform {
  /**
   * Transforms input
   * @param value
   * @param key
   * @returns {any}
   */
  transform(value: unknown, key?: 'val' | 'repr'): string {
    return ResourceHelper.getResourceColumnData(value, key);
  }
}

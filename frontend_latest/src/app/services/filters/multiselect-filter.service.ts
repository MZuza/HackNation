import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MultiselectFilterService {
  /**
   * Returns new multiselect data
   * @param {MultiselectOption } selectedIds
   * @param {Option } selectedOption
   * @return {MultiselectOption}
   */
  changeMultiselect(selectedIds, selectedOption) {
    const filterGroup = Object.assign({}, selectedIds);

    if (filterGroup[selectedOption.id]) {
      delete filterGroup[selectedOption.id];
    } else {
      filterGroup[selectedOption.id] = selectedOption;
    }

    return filterGroup;
  }

  changeSingleselect(selectedOption) {
    const singlefilter = {};
    if (selectedOption) {
      singlefilter[selectedOption.region_id] = selectedOption;
    }

    return singlefilter;
  }

  /**
   * check if filter has changed
   * @param {MultiselectOption } changedData
   * @param {MultiselectOption } initialData
   * @return {boolean}
   */
  getAvailability(changedData, initialData): boolean {
    if (!initialData) {
      const keys = Object.keys(changedData).length;
      return !!keys;
    }

    const changedKeys = Object.keys(changedData);
    const initialKeys = Object.keys(initialData);

    if (changedKeys.length !== initialKeys.length) {
      return true;
    }

    let isDifferent = false;

    changedKeys.forEach((changedKey: string) => {
      if (!initialKeys.includes(changedKey)) {
        isDifferent = true;
      }
    });

    return isDifferent;
  }
}

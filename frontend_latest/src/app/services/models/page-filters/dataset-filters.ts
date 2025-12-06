import { AggregationFilterNames, MultiselectOption, SingleselectOptionForRegions } from '@app/services/models/filters';

export interface IListViewDatasetFiltersModel {
  [AggregationFilterNames.CATEGORIES]: MultiselectOption;
  [AggregationFilterNames.INSTITUTION]: MultiselectOption;
  [AggregationFilterNames.FORMAT]: MultiselectOption;
  [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
  [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
  [AggregationFilterNames.LICENSES]: MultiselectOption;
  [AggregationFilterNames.TYPES]: MultiselectOption;
  [AggregationFilterNames.DATE_FROM]: Date;
  [AggregationFilterNames.DATE_TO]: Date;
  [AggregationFilterNames.HIGH_VALUE_DATA]: MultiselectOption;
  [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: MultiselectOption;
  [AggregationFilterNames.REGIONS]: SingleselectOptionForRegions;
  [AggregationFilterNames.DYNAMIC_DATA]: MultiselectOption;
  [AggregationFilterNames.RESEARCH_DATA]: MultiselectOption;
  [AggregationFilterNames.LANGUAGE]: MultiselectOption;
  [AggregationFilterNames.PROTECTED_DATA]: MultiselectOption;
}

export interface IListViewDatasetCategoryFiltersModel {
  [AggregationFilterNames.CATEGORIES]: MultiselectOption;
  [AggregationFilterNames.INSTITUTION]: MultiselectOption;
  [AggregationFilterNames.FORMAT]: MultiselectOption;
  [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
  [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
  [AggregationFilterNames.LICENSES]: MultiselectOption;
  [AggregationFilterNames.UPDATE_FREQUENCY]: MultiselectOption;
  [AggregationFilterNames.TYPES]: MultiselectOption;
  [AggregationFilterNames.HIGH_VALUE_DATA]: MultiselectOption;
  [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: MultiselectOption;
  [AggregationFilterNames.DATE_FROM]: Date;
  [AggregationFilterNames.DATE_TO]: Date;
  [AggregationFilterNames.REGIONS]: SingleselectOptionForRegions;
  [AggregationFilterNames.DYNAMIC_DATA]: MultiselectOption;
  [AggregationFilterNames.RESEARCH_DATA]: MultiselectOption;
  [AggregationFilterNames.LANGUAGE]: MultiselectOption;
  [AggregationFilterNames.PROTECTED_DATA]: MultiselectOption;
}

export const DatasetListViewFilterNames = [
  AggregationFilterNames.CATEGORIES,
  AggregationFilterNames.INSTITUTION,
  AggregationFilterNames.FORMAT,
  AggregationFilterNames.OPENNESS_SCORE,
  AggregationFilterNames.VISUALIZATION_TYPE,
  AggregationFilterNames.LICENSES,
  AggregationFilterNames.UPDATE_FREQUENCY,
  AggregationFilterNames.TYPES,
  AggregationFilterNames.HIGH_VALUE_DATA,
  AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC,
  AggregationFilterNames.DATE_FROM,
  AggregationFilterNames.DATE_TO,
  AggregationFilterNames.REGIONS,
  AggregationFilterNames.DYNAMIC_DATA,
  AggregationFilterNames.RESEARCH_DATA,
  AggregationFilterNames.LANGUAGE,
  AggregationFilterNames.PROTECTED_DATA
];

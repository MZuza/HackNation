import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewInstitutionItemFiltersModel {
  [AggregationFilterNames.CATEGORIES]: MultiselectOption;
  [AggregationFilterNames.FORMAT]: MultiselectOption;
  [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
  [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
  [AggregationFilterNames.TYPES]: MultiselectOption;
  [AggregationFilterNames.LICENSES]: MultiselectOption;
  [AggregationFilterNames.UPDATE_FREQUENCY]: MultiselectOption;
  [AggregationFilterNames.DATE_FROM]: Date;
  [AggregationFilterNames.DATE_TO]: Date;
  [AggregationFilterNames.HIGH_VALUE_DATA]: MultiselectOption;
  [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: MultiselectOption;
  [AggregationFilterNames.DYNAMIC_DATA]: MultiselectOption;
  [AggregationFilterNames.RESEARCH_DATA]: MultiselectOption;
  [AggregationFilterNames.PROTECTED_DATA]: MultiselectOption;
}
export interface IListViewInstitutionItemCategoryFiltersModel {
  [AggregationFilterNames.CATEGORIES]: MultiselectOption;
  [AggregationFilterNames.FORMAT]: MultiselectOption;
  [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
  [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
  [AggregationFilterNames.TYPES]: MultiselectOption;
  [AggregationFilterNames.LICENSES]: MultiselectOption;
  [AggregationFilterNames.UPDATE_FREQUENCY]: MultiselectOption;
  [AggregationFilterNames.DATE_FROM]: Date;
  [AggregationFilterNames.DATE_TO]: Date;
  [AggregationFilterNames.HIGH_VALUE_DATA]: MultiselectOption;
  [AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC]: MultiselectOption;
  [AggregationFilterNames.DYNAMIC_DATA]: MultiselectOption;
  [AggregationFilterNames.RESEARCH_DATA]: MultiselectOption;
  [AggregationFilterNames.PROTECTED_DATA]: MultiselectOption;
}

export const InstitutionItemListViewFilterNames = [
  AggregationFilterNames.CATEGORIES,
  AggregationFilterNames.FORMAT,
  AggregationFilterNames.OPENNESS_SCORE,
  AggregationFilterNames.VISUALIZATION_TYPE,
  AggregationFilterNames.TYPES,
  AggregationFilterNames.LICENSES,
  AggregationFilterNames.UPDATE_FREQUENCY,
  AggregationFilterNames.DATE_FROM,
  AggregationFilterNames.DATE_TO,
  AggregationFilterNames.HIGH_VALUE_DATA,
  AggregationFilterNames.HIGH_VALUE_DATA_FROM_EC,
  AggregationFilterNames.DYNAMIC_DATA,
  AggregationFilterNames.RESEARCH_DATA,
  AggregationFilterNames.PROTECTED_DATA
];

import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewApplicationsFiltersModel {
  [AggregationFilterNames.SHOWCASE_CATEGORY]: MultiselectOption;
  [AggregationFilterNames.SHOWCASE_TYPE]: MultiselectOption;
  [AggregationFilterNames.SHOWCASE_PLATFORMS]: MultiselectOption;
}

export const ApplicationsListViewFilterNames = [
  AggregationFilterNames.SHOWCASE_CATEGORY,
  AggregationFilterNames.SHOWCASE_TYPE,
  AggregationFilterNames.SHOWCASE_PLATFORMS,
];

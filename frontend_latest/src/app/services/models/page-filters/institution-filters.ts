import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewInstitutionFiltersModel {
  [AggregationFilterNames.INSTITUTION_TYPE]: MultiselectOption;
}

export const InstitutionListViewFilterNames = [AggregationFilterNames.INSTITUTION_TYPE];

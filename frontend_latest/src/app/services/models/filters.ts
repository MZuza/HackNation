export interface IAggregationProperties {
  id: string;
  doc_count: number;
  title: string;
  titleTranslationKey?: string;
}

export interface IAggregationPropertiesForRegions {
  bbox?: [];
  hierarchy_label?: string;
  region_id: number;
  title?: string;
  areaTranslationKey?: string;
  doc_count?: number;
}

export enum AggregationOptionType {
  CATEGORIES = 'by_categories',
  LICENSES = 'by_license_code',
  CITY = 'by_city',
  CREATED = 'by_created',
  FORMAT = 'by_format',
  INSTITUTION = 'by_institution',
  INSTITUTION_TYPE = 'by_institution_type',
  MODIFIED = 'by_modified',
  OPENNESS_SCORE = 'by_openness_score',
  TAG = 'by_tag',
  VERIFIED = 'by_verified',
  VISUALIZATION_TYPE = 'by_visualization_types',
  UPDATE_FREQUENCY = 'by_update_frequency',
  TYPES = 'by_types',
  HIGH_VALUE_DATA = 'by_has_high_value_data',
  HIGH_VALUE_DATA_FROM_EC = 'by_has_high_value_data_from_ec_list',
  SHOWCASE_TYPE = 'by_showcase_types',
  SHOWCASE_CATEGORY = 'by_showcase_category',
  SHOWCASE_PLATFORMS = 'by_showcase_platforms',
  DYNAMIC_DATA = 'by_has_dynamic_data',
  RESEARCH_DATA = 'by_has_research_data',
  REGIONS = 'by_regions',
  LANGUAGE = 'by_language',
  PROTECTED_DATA = 'by_contains_protected_data'
}

export enum AggregationFilterNames {
  CATEGORIES = 'categories',
  INSTITUTION = 'institution',
  LICENSES = 'license_code',
  FORMAT = 'format',
  OPENNESS_SCORE = 'openness_score',
  VISUALIZATION_TYPE = 'visualization_types',
  UPDATE_FREQUENCY = 'update_frequency',
  TYPES = 'types',
  DATE_FROM = 'date[gte]',
  DATE_TO = 'date[lte]',
  INSTITUTION_TYPE = 'institution_type',
  HIGH_VALUE_DATA = 'has_high_value_data',
  HIGH_VALUE_DATA_FROM_EC = 'has_high_value_data_from_ec_list',
  SHOWCASE_TYPE = 'showcase_types',
  SHOWCASE_CATEGORY = 'showcase_category',
  SHOWCASE_PLATFORMS = 'showcase_platforms',
  REGIONS = 'regions',
  DYNAMIC_DATA = 'has_dynamic_data',
  RESEARCH_DATA = 'has_research_data',
  LANGUAGE = 'language',
  PROTECTED_DATA = 'contains_protected_data'
}

export interface IListViewFilterAggregationsOptions {
  [AggregationOptionType.CATEGORIES]?: IAggregationProperties[];
  [AggregationOptionType.INSTITUTION]?: IAggregationProperties[];
  [AggregationOptionType.FORMAT]?: IAggregationProperties[];
  [AggregationOptionType.OPENNESS_SCORE]?: IAggregationProperties[];
  [AggregationOptionType.VISUALIZATION_TYPE]?: IAggregationProperties[];
  [AggregationOptionType.LICENSES]?: IAggregationProperties[];
  [AggregationOptionType.UPDATE_FREQUENCY]?: IAggregationProperties[];
  [AggregationOptionType.TYPES]?: IAggregationProperties[];
  [AggregationOptionType.HIGH_VALUE_DATA]?: IAggregationProperties[];
  [AggregationOptionType.HIGH_VALUE_DATA_FROM_EC]?: IAggregationProperties[];
  [AggregationOptionType.SHOWCASE_TYPE]?: IAggregationProperties[];
  [AggregationOptionType.SHOWCASE_CATEGORY]?: IAggregationProperties[];
  [AggregationOptionType.SHOWCASE_PLATFORMS]?: IAggregationProperties[];
  [AggregationOptionType.DYNAMIC_DATA]?: IAggregationProperties[];
  [AggregationOptionType.RESEARCH_DATA]?: IAggregationProperties[];
  [AggregationOptionType.REGIONS]?: IAggregationPropertiesForRegions[];
  [AggregationOptionType.PROTECTED_DATA]?: IAggregationProperties[];
}

export interface IDatasetListViewFilterAggregationsOptions {
  [AggregationOptionType.CATEGORIES]?: IAggregationProperties[];
  [AggregationOptionType.INSTITUTION]?: IAggregationProperties[];
  [AggregationOptionType.FORMAT]?: IAggregationProperties[];
  [AggregationOptionType.OPENNESS_SCORE]?: IAggregationProperties[];
  [AggregationOptionType.VISUALIZATION_TYPE]?: IAggregationProperties[];
  [AggregationOptionType.LICENSES]?: IAggregationProperties[];
  [AggregationOptionType.UPDATE_FREQUENCY]?: IAggregationProperties[];
  [AggregationOptionType.TYPES]?: IAggregationProperties[];
  [AggregationOptionType.HIGH_VALUE_DATA]?: IAggregationProperties[];
  [AggregationOptionType.HIGH_VALUE_DATA_FROM_EC]?: IAggregationProperties[];
  [AggregationOptionType.DYNAMIC_DATA]?: IAggregationProperties[];
  [AggregationOptionType.RESEARCH_DATA]?: IAggregationProperties[];
  [AggregationOptionType.PROTECTED_DATA]?: IAggregationProperties[];
}

export interface MultiselectOption {
  [key: string]: IAggregationProperties;
}

export interface SingleselectOptionForRegions {
  [key: string]: IAggregationPropertiesForRegions;
}

export interface DaterangeFilterUpdated {
  name: string;
  value: Date;
}

export interface DaterangeFilterModel {
  [name: string]: Date;
}

export interface FiltersToSend {
  [name: string]: string | number | Date;
}

export interface FilterName {
  [name: string]: any;
}

export type FilterModelValue = MultiselectOption & Date;

export interface FilterModel {
  [name: string]: FilterModelValue;
}

export interface DaterangeFilterAvailability {
  [name: string]: boolean;
}

export interface AvailabilityFilterMap {
  [key: string]: boolean;
}

export interface SelectedFilter {
  names: string | string[];
  key: string;
  isDate: boolean;
}

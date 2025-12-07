import { Params } from '@angular/router';

export interface BasicPageParams extends Params {
  sort?: string;
  per_page?: string | number;
  q?: string;
  page?: number;
}

export interface IAggregationFiltersParams {
  'created[gte]'?: string;
  'created[lte]'?: string;
  'date[gte]'?: string;
  'date[lte]'?: string;
  'categories[id][terms]'?: number;
  'institution[id][terms]'?: number;
  'format[terms]'?: string;
  'openness_score[terms]'?: number;
  'regions[id][terms]'?: number;
}

export interface IModelTermsParams extends BasicPageParams {
  'model[terms]'?: string; // 'dataset' | 'resource' | 'dataset,resource' | 'news' | 'institution' | 'showcases'
}

export interface ITagsPageParams {
  tags?: string;
}

export type PageParams = BasicPageParams & IAggregationFiltersParams & IModelTermsParams & ITagsPageParams;

export interface INewsPageParams extends BasicPageParams {
  children_per_page?: string | number;
  children_page?: number;
  children_extra_fields?: string;
  children_sort?: string;
}

export interface IHasImageThumbParams extends BasicPageParams {
  has_image_thumb?: boolean;
}

import { ApiModel } from '@app/services/api/api-model';
import { ResultItemDetailsData } from '@app/services/models/result-item-details';

export interface ISearchResponse {
  meta: {
    count: number;
    aggregations: {
      counters: ISearchCounters;
    };
  };
  data: ISearchResult[];
  links: {
    self: string;
  };
}

export interface ISearchResult {
  type: string;
  attributes: ISearchResultAttributes;
  relationships: ISearchResultRelationships;
  id: string;
  url?: string;
  titleTranslationKey?: string;
  detailsData?: ResultItemDetailsData[];
}

export interface ISearchResultAttributes {
  modified: string;
  tags: string[];
  author: string;
  created: string;
  title: string;
  notes: string;
  slug: string;
  verified: string;
  data_date: string;
  model: ApiModel;
  category: {
    description: string;
    title: string;
    id: string;
  };
  source?: {
    last_import_timestamp: string;
    title: string;
    type: string;
    update_frequency: string;
    url: string;
  };
  language?: string;
}

export interface ISearchResultRelationships {
  institution: ISearchResultRelationshipsData;
  dataset: ISearchResultRelationshipsData;
  related_resource?: ISearchResultRelationshipsData;
}

export interface ISearchCounters {
  applications: number;
  articles: number;
  datasets: number;
  institutions: number;
  knowledge_base: number;
  resources: number;
  showcases: number;
  news: number;
}

interface ISearchResultRelationshipsData {
  data: {
    type: string;
    id: string;
  };
}

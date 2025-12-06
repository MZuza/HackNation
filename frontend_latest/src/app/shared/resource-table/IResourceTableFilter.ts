import { ResourceTableColumn } from './ResourceTableColumn';

export interface IResourceTableFilter {
  column: ResourceTableColumn;
  operator: string;
  phrase: string;
  phraseTime?: string;
  query: string;
  typeTranslationKey: string;
}

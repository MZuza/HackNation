export interface IDatasetFile {
  file_size?: number;
  download_url?: string;
  format?: string;
  openness_score?: number;
}

export interface IDatasetRegionsList {
    hierarchy_label: string;
    is_additional: boolean;
    name: string;
    region_id: string;
}

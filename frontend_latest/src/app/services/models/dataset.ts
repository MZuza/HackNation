export interface IDataset {
    license_title: string;
    maintainer: any;
    private: boolean;
    maintainer_email: any;
    num_tags: number;
    api: boolean;
    update_frequency: string;
    id: string;
    metadata_created: string;
    category: string;
    metadata_modified: string;
    author: any;
    author_email: any;
    state: string;
    version: any;
    archiver: any;
    license_id: string;
    type: string;
    resources: IDatasetResource[];
    revision_id: string;
    num_resources: number;
    tags: any[]; // TODO: create Tags interface
    tracking_summary: ITrackingSummary;
    license_condition_source: boolean;
    groups: any[]; // TODO: create groups interface
    creator_user_id: string;
    license_condition_db_or_copyrighted: string;
    organization: any; // TODO: create organization interface
    name: string; // slug
    isOpen: boolean;
    url: string;
    notes: string;
    owner_org: string;
    qa: IQualityAssurance;
    title: string;
    license_condition_responsibilities: string;
    resources_tracking_summary: ITrackingSummary;
}

export interface IDatasetResource {
    archiver: any;
    cache_last_updated: string;
    cache_url: string;
    created: string;
    datastore_active: boolean;
    description: string;
    format: string;
    hash: string;
    id: string;
    last_modified: string;
    mimetype: string;
    mimetype_inner: string;
    name: string;
    package_id: string;
    position: number;
    qa: IQualityAssurance;
    resource_type: string;
    revision_id: string;
    size: string;
    state: string;
    tracking_summary: ITrackingSummary;
    url: string;
    url_type: string;
    webstore_last_updated: string;
    webstore_url: string;
}

export interface ITrackingSummary {
    total: number;
    recent: number;
}

export interface IQualityAssurance {
    updated: string;
    openness_score: number;
    archival_timestamp: string;
    format: string;
    created: string;
    resource_timestamp: any;
    openness_score_reason: string;
}

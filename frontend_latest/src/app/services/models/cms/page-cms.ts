import { IMetadataPageCms } from '@app/services/models/cms/metadata-page-cms';
import { IWidget } from '@app/services/models/cms/widgets/widget';

export interface IPageCms {
    id: number;
    meta: IMetadataPageCms;
    title: string;
    url_path: string;
    last_published_at: string;
    latest_revision_created_at: string;
    background_image: any;
    background_color: string;
    background_paralax: boolean;
    body: {
        blocks: IWidget[]
    };
}

export interface IPagesListCms {
    meta: {
        total_count: number;
    };
    items: [
        {
            id: number;
            meta: {
                type: string;
                detail_url: string;
                html_url: string;
                slug: string;
                first_published_at: string;
            },
            title: string;
        }
    ];
}

export enum StaticPageType {
    FORMS = 'cms.FormPage',
    SIMPLE = 'cms.SimplePage',
    LANDING = 'cms.LandingPage'
}

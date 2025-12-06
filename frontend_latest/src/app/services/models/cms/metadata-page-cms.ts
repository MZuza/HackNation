export interface IMetadataPageCms {
    detail_url: string;
    first_published_at: Date;
    html_url: string;
    url_path: string;
    parent: any;
    search_description: string;
    seo_title: string;
    show_in_menus: boolean;
    slug: string;
    type: string;
    children?: IMetadataPageChildrenCms[];
}

export interface IMetadataPageChildrenCms {
    id: number;
    meta: {
        type: string,
        detail_url: string
        html_url: string;
        slug: string;
        first_published_at: string;
        url_path: string;
    };
    title: string;
}

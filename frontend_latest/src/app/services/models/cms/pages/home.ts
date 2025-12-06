import { IPageCms } from '@app/services/models/cms/page-cms';
import { IWidget } from '@app/services/models/cms/widgets/widget';

export interface IHome extends IPageCms {
    over_login_section_cb: IWidget[];
    over_search_field_cb: IWidget[];
    over_latest_news_cb: IWidget[];
    header_gov: {
        blocks: IWidget[]
    };
    footer_nav: {
        blocks: IWidget[]
    };
    footer_logos: IWidget[];
}

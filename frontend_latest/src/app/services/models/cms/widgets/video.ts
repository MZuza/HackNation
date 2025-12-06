import {ISettings} from '@app/services/models/cms/controls/settings';
import {IWidget} from '@app/services/models/cms/widgets/widget';

export interface IVideo extends IWidget {
    value: {
        caption: string;
        video: string;
        uploaded_video?: {
            tilte: string;
            download_url: string;
            thumbnail_url: string;
        }
    };
}

export interface IVideoHyperEditor extends IWidget {
    general: any;
    settings: ISettings;
}

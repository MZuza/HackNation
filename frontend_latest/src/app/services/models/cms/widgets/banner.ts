import { IWidget } from '@app/services/models/cms/widgets/widget';

export interface IBanner extends IWidget {
    value: {
        image: number;
        action_url?: string;
        alt?: string;
        format?: string;
        target?: string;
    };
}

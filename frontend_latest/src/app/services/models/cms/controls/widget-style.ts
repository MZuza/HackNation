import { IColor } from '@app/services/models/cms/controls/color';
import { ISpace } from '@app/services/models/cms/controls/space';

export interface IWidgetStyle {
    general: {
        margin: ISpace;
        padding: ISpace;
        backgroundColor: IColor;
        foregroundColor: IColor;
        style: string;
        textAlignment: string;
        classes: string;
    };
}

export interface IWidgetStyleForHtmlInject {
    'background-color'?: string;
    'background-image'?: string;
    'color'?: string;
    'margin'?: string;
    'padding'?: string;
    'text-align'?: string;
}

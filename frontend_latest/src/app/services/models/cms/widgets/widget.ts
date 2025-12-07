import {ISettings} from '@app/services/models/cms/controls/settings';
import {IWidgetStyle} from '@app/services/models/cms/controls/widget-style';
import {WidgetType} from '@app/services/models/cms/widgets/widget-type';

export interface IWidget extends IWidgetStyle {
    type: WidgetType;
    id: string;
    children?: IWidget[];
    settings?: ISettings;
    classname?: string;
}

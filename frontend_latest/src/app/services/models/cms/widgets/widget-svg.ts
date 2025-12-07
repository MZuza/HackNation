import { IWidget } from '@app/services/models/cms/widgets/widget';

export interface IWidgetSvg extends IWidget {
  value: {
    download_url: string;
    title: string;
  };
}

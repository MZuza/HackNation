import { NgIf } from '@angular/common';
import {Component, Input} from '@angular/core';
import { ImageComponent } from '../../image/image.component';
import { VideoComponent } from '../../video/video.component';

import {IRawTextEmbed} from '@app/services/models/cms/controls/raw-text/raw-text-embed';
import {IRawTextEmbedType} from '@app/services/models/cms/controls/raw-text/raw-text-embed-type.enum';
import {IBanner} from '@app/services/models/cms/widgets/banner';
import {IVideo} from '@app/services/models/cms/widgets/video';
import {WidgetType} from '@app/services/models/cms/widgets/widget-type';

@Component({
    selector: 'raw-text-embed-object',
    templateUrl: './raw-text-embed.component.html',
    standalone: true,
    imports: [NgIf, VideoComponent, ImageComponent]
})
export class RawTextEmbedComponent {

    @Input() embedObject: IRawTextEmbed;

    constructor() {
    }

    /**
     * Returns enums RawTestEmbedType.
     */
    public getEmbedType() {
        return IRawTextEmbedType;
    }


    public createBannerObject(): IBanner {
        return {
            type: WidgetType.BANNER,
            id: '',
            general: null,
            value: {
                image: +this.embedObject.id,
                alt: this.embedObject.alt,
                format: this.embedObject.format
            }
        };
    }

    public createVideoObject(): IVideo {
        return {
            type: WidgetType.VIDEO,
            id: '',
            general: null,
            value: {
                caption: null,
                video: this.embedObject.url
            }
        };
    }
}

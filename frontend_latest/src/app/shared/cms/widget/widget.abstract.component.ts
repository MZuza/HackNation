import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {CmsService} from '@app/services/cms.service';
import {IPageCms} from '@app/services/models/cms/page-cms';

@Component({
    selector: 'app-cms.abstract',
    template: '<div> </div>',
    standalone: true
})
export class WidgetAbstractComponent {

    @Input() pageCms: IPageCms;

    constructor(protected cmsService: CmsService,
                protected sanitizer: DomSanitizer) {
    }

    /**
     * Gets meta data image from CMS.
     * @param id image in CMS
     */
    protected getImageMetaData(id: number) {
        return this.cmsService.getImageMetaData(id);
    }

    /**
     * Gets a physical image from CMS.
     * @param url image
     */
    protected getImage(url: string) {
        return this.cmsService.getImage(url);
    }

}

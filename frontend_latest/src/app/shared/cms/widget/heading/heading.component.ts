import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CmsService } from '@app/services/cms.service';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';

@Component({
    selector: 'cms-heading',
    templateUrl: './heading.component.html',
    standalone: true,
    imports: [NgStyle]
})
export class HeadingComponent extends WidgetAbstractComponent implements OnInit {

    @Input() heading: IWidget;

    style: any;

    constructor(cmsService: CmsService, sanitizer: DomSanitizer) {
        super(cmsService, sanitizer);
    }

    ngOnInit() {
        this.style = this.cmsService.addStyle(this.heading);
    }
}

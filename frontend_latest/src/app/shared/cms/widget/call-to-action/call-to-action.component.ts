import { NgClass, NgIf, NgStyle } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SanitizeUrlPipe } from '../../../pipes/sanitize-url.pipe';

import {ICta} from '@app/services/models/cms/widgets/cta';
import {WidgetAbstractComponent} from '@app/shared/cms/widget/widget.abstract.component';
import {StringHelper} from '@app/shared/helpers/string.helper';

/**
 * Call To Action component displays CTA widget from CMS
 * @example
 * <cms-call-to-action></cms-call-to-action>
 */
@Component({
    selector: 'cms-call-to-action',
    templateUrl: './call-to-action.component.html',
    standalone: true,
    imports: [
        NgStyle,
        NgIf,
        NgClass,
        SanitizeUrlPipe,
    ],
})
export class CallToActionComponent extends WidgetAbstractComponent implements OnInit {

    /**
    * Call To Action data
    */
    @Input() cta: ICta;

    /**
    * Event emitted when content has loaded
    */
    @Output() ctaHasLoaded = new EventEmitter<boolean>();

    /**
     * Unique id
     */
    generatedId = StringHelper.generateRandomHex();

    /**
     * Determines whether content is loaded
     */
    ngOnInit() {
        this.ctaHasLoaded.emit(true);
    }
}

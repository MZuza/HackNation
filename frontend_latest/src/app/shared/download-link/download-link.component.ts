import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FileSizeComponent } from '../file-size/file-size.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

/**
 * download link Component
 */
@Component({
    selector: 'app-download-link',
    templateUrl: './download-link.component.html',
    standalone: true,
    imports: [NgIf, NgClass, RouterLink, TooltipDirective, FileSizeComponent, UpperCasePipe, TranslatePipe]
})
export class DownloadLinkComponent {
    /**
     * title
     */
    @Input() title: string;

    /**
     * file size
     */
    @Input() fileSize: number;

    /**
     * file format
     */
    @Input() format: string;

    /**
     * file url to download
     */
    @Input() fileUrl: string;

    /**
     * show download text
     */
    @Input() showDownloadText = false;

    /**
     * custom css class for styling
     */
    @Input() customCssClass: string;

    /**
     * show star rating data openness
     */
    @Input() opennessScore: number;
}

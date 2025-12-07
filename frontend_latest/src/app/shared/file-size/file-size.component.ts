import { DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * file size Component
 */
@Component({
    selector: 'app-file-size',
    templateUrl: './file-size.component.html',
    standalone: true,
    imports: [NgIf, DecimalPipe, TranslatePipe]
})
export class FileSizeComponent {
    /**
     * file size
     */
    @Input() fileSize: number;
}

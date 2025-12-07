import { NgIf } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {LabListItemReport} from '@app/user/lab/lab-list/LabListItemReport';

/**
 * Lab List Component
 */
@Component({
    selector: 'app-lab-list-report-button',
    templateUrl: './lab-list-report-button.component.html',
    standalone: true,
    imports: [NgIf, TranslatePipe]
})
export class LabListReportButtonComponent implements OnInit {

    /**
     * Report item
     */
    @Input()
    report: LabListItemReport;

    /**
     * Determines if file count should be visible
     */
    @Input()
    showFilesCount: boolean;

    /**
     * Determines if report is type of file
     */
    isFileReport: boolean;

    /**
     * Sets file report flag
     */
    ngOnInit() {
        this.isFileReport = this.report.type === 'file';
    }
}

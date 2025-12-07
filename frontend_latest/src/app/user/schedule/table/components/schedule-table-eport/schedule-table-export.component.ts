import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ScheduleExportSource } from '@app/user/schedule/table/domain/schedule-table.config';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

@Component({
    selector: 'app-schedule-table-export',
    templateUrl: './schedule-table-export.component.html',
    standalone: true,
    imports: [TranslatePipe],
})
export class ScheduleTableExportComponent {
    /**
     * Exportable id
     * @type {number}
     */
    @Input()
    exportableId: number;
    /**
     * Full export enabled flag
     * @type {boolean}
     */
    @Input()
    isFullExport: boolean = false;

    /**
     * Export source
     * @type {number}
     */
    @Input()
    exportSource: ScheduleExportSource;

    /**
     * @ignore
     * @param scheduleService
     */
    constructor(private readonly scheduleService: ScheduleService) {
    }

    /**
     * Generates download url
     * @param format
     */
    generateUrl(format: 'csv' | 'xlsx') {
        this.scheduleService.getExportUrl(this.exportSource, this.exportableId, format, this.isFullExport)
            .subscribe(url => {
                window.open(url, '_blank');
            });

    }
}

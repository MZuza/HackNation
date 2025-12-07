import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  ResourceItemFilesDownloadComponent
} from '@app/pages/dataset/resource-list/resource-item-files-download/resource-item-files-download.component';
import { ResourceItemInfoComponent } from '@app/pages/dataset/resource-list/resource-item-info/resource-item-info.component';
import { IDownloadFile } from '@app/services/models/download-item';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';

/**
 * Component to show dataset item results
 */
@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  imports: [
    ResultListComponent,
    ResourceItemInfoComponent,
    ResourceItemFilesDownloadComponent
  ],
  standalone: true
})
export class ResourceListComponent {

    /**
     * Router endpoints of resource list component
     */
    routerEndpoints = RouterEndpoints;
    /**
     * resource items to display
     */
    @Input() items: any;

    /**
     * determines if created sort param is active
     */
    @Input() isSortParamsCreated = false;

    /**
     * determines if data date sort param is active
     */
    @Input() isSortParamsDataDate = false;

    /**
     * Event emitter for download event
     */
    @Output() download = new EventEmitter<IDownloadFile>();

    /**
     * triggers download event emitter
     * @param {IDownloadFile} file
     */
    onDownload(file: IDownloadFile) {
        this.download.emit(file);
    }
}

import { LowerCasePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CmsBlock2Component } from '../cms/cms-block2/cms-block2.component';
import { FocusTrapDirective } from '../directives/focus-trap/focus-trap.directive';
import { LoaderComponent } from '../loader/loader.component';

import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsService } from '@app/services/cms.service';
import { IPageCms } from '@app/services/models/cms/page-cms';

@Component({
    selector: 'app-rodo-modal',
    templateUrl: './rodo-modal.component.html',
    standalone: true,
    imports: [
        FocusTrapDirective,
        NgIf,
        LoaderComponent,
        CmsBlock2Component,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class RodoModalComponent implements OnInit {
  @Output() isModalClosed = new EventEmitter<null>();

  pageTitle: string;
  page: Subscription;
  pageWidget = new BehaviorSubject(null);

  constructor(private cmsService: CmsService) {}

  ngOnInit() {
    this.page = this.cmsService.getSimplePage(CmsHardcodedPages.GDPR).subscribe((pageList: IPageCms) => {
      this.pageTitle = pageList.title;
      this.pageWidget.next([pageList]);
    });
  }

  closeModal() {
    this.isModalClosed.emit();
  }
}

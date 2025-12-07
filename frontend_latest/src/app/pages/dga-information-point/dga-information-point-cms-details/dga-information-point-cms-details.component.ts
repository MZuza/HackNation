import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IPageCms } from '@app/services/models/cms/page-cms';
import { SeoService } from '@app/services/seo.service';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';

@Component({
  selector: 'app-dga-information-point-cms-details',
  templateUrl: './dga-information-point-cms-details.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    NgForOf,
    CmsBlock2Component
  ]
})
export class DgaInformationPointCmsDetailsComponent implements OnInit {

  pageData: IPageCms;
  parentUrlPath: string;

  constructor(
    private seoService: SeoService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.pageData = this.route.snapshot.data['post'];
    this.parentUrlPath = '/' + this.translate.currentLang + '/dga';
    this.seoService.setPageTitle(this.pageData.title);
  }

}

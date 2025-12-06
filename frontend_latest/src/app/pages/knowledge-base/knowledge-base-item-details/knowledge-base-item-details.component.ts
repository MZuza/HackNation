import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { IPageCms } from '@app/services/models/cms/page-cms';
import { SeoService } from '@app/services/seo.service';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';

/**
 * Preview component for cms details
 */
@Component({
    selector: 'app-knowledge-base-item-details',
    templateUrl: './knowledge-base-item-details.component.html',
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        NgFor,
        CmsBlock2Component,
        TranslatePipe,
    ],
})
export class KnowledgeBaseItemDetailsComponent implements OnInit {
  /**
   * data from cms
   */
  pageData: IPageCms;

  /**
   * parent path url for back link
   * **/
  parentUrlPath: string;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private route: ActivatedRoute) {}

  /**
   * Sets page data from resolved request
   */
  ngOnInit() {
    this.pageData = this.route.snapshot.data['post'];
    this.seoService.setPageTitle(this.pageData.title);
    this.parentUrlPath = '/pl/knowledgebase/' + this.pageData.meta.parent.meta.slug;
  }
}

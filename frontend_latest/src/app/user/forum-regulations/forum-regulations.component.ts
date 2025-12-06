import { Component, OnInit } from '@angular/core';

import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { SeoService } from '@app/services/seo.service';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

@Component({
    selector: 'app-forum-regulations',
    templateUrl: './forum-regulations.component.html',
    standalone: true,
    imports: [CmsStaticPageComponent]
})
export class ForumRegulationsComponent implements OnInit {

    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) { }

    /**
     * Sets title (browser tab)
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['Breadcrumbs.ForumRegulationsComponent']);
    }
}

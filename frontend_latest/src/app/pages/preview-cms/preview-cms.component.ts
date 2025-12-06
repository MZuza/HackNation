import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

/**
* Preview CMS pages component
*/
@Component({
  selector: 'app-preview-cms',
  templateUrl: './preview-cms.component.html',
  imports: [
    CmsStaticPageComponent
  ],
  standalone: true
})
export class PreviewCmsComponent implements OnInit {

    /**
     * Page url
     */
    requestedPageUrl: string;

    /**
     * Page query params
     */
    queryParams: Params;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    /**
    * Get slug and query params from route. Display content only for admin.
    */
    ngOnInit() {
        this.queryParams = this.activatedRoute.snapshot.queryParams;
        this.requestedPageUrl = this.router.url;
        this.requestedPageUrl = this.requestedPageUrl.substring(3);
    }
}



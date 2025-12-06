import { Component } from '@angular/core';

import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

/**
 * Declaration of availability - CMS content
 */
@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  imports: [
    CmsStaticPageComponent
  ],
  standalone: true
})
export class DeclarationComponent {

    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;
}

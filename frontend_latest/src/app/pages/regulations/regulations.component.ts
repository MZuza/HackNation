import { Component } from '@angular/core';

import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

/**
* Regulations component
*/
@Component({
  selector: 'app-regulations',
  templateUrl: './regulations.component.html',
  imports: [
    CmsStaticPageComponent
  ],
  standalone: true
})
export class RegulationsComponent {

    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;
}

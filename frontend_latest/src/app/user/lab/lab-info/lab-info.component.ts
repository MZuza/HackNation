import {Component, OnInit} from '@angular/core';

import {CmsHardcodedPages} from '@app/services/api/api.cms.config';
import { SeoService } from '@app/services/seo.service';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

@Component({
    selector: 'app-lab-info',
    templateUrl: './lab-info.component.html',
    standalone: true,
    imports: [CmsStaticPageComponent],
})
export class LabInfoComponent implements OnInit {

    /**
     * CMS static page slugs
     */
    readonly cmsHardcodedPages = CmsHardcodedPages;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Informacje', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}

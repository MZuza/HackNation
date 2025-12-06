import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SeoService } from '@app/services/seo.service';
import { WriteUsInfoComponent } from '@app/shared/write-us-info/write-us-info.component';

/**
 * Sitemap Component
 */
@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  imports: [
    TranslatePipe,
    RouterLink,
    LocalizeRouterPipe,
    WriteUsInfoComponent
  ],
  standalone: true
})
export class SitemapComponent implements OnInit {
    /**
     * Router endpoints
     */
    readonly routerEndpoints = RouterEndpoints;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['Menu.Sitemap']);
    }
}

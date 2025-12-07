import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DatasetService } from '@app/services/dataset.service';
import { SeoService } from '@app/services/seo.service';
import { ResourceFiltersComponent } from '@app/shared/resource-filters/resource-filters.component';

/**
 * Embedded Component
 */
@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
  imports: [
    RouterLink,
    RouterOutlet,
    TranslateModule,
    RouterLinkActive,
    NgIf,
    ResourceFiltersComponent
  ],
  standalone: true
})
export class EmbeddedComponent implements OnInit {

    /**
     * Resource id
     */
    resourceId: string;

    /**
     * Determines whether resource has tabular view
     */
    hasTabularData = false;

    /**
     * Determines whether resource has chart view
     */
    hasChart = false;

    /**
     * Determines whether resource has geo view
     */
    hasGeoData = false;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private datasetService: DatasetService) {
    }

    /**
     * Initializes and updates tabular data (result) and component language on query params change.
     * Checks availability of related data (tabs).
     */
    ngOnInit() {
        this.resourceId = this.route.snapshot.paramMap.get('resourceId');
        const lang = this.route.snapshot.queryParamMap.get('lang');

        if (lang && ['pl', 'en'].indexOf(lang) !== -1) {
            this.translate.use(lang);
        }

        return this.datasetService
            .getResourceById(this.resourceId)
            .subscribe(resource => {
                this.seoService.setPageTitle(resource['attributes']['title']);

                if (!resource['relationships']) {
                    return;
                }

                this.hasGeoData = resource['relationships']['geo_data'];
                this.hasChart = resource['relationships']['chart'];
                this.hasTabularData = this.hasGeoData || resource['relationships']['tabular_data'];
            });
    }
}

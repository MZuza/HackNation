import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApplicationsComponent } from './applications/applications.component';
import { CategoriesComponent } from './categories/categories.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { NewsComponent } from './news/news.component';
import { ServiceAlertComponent } from './service-alert/service-alert.component';
import { StatsComponent } from './stats/stats.component';

import { AbstractService } from '@app/services/abstract.service';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { ApplicationsService } from '@app/services/applications.service';
import { CmsService } from '@app/services/cms.service';
import { IHome } from '@app/services/models/cms/pages/home';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { IHasImageThumbParams } from '@app/services/models/page-params';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';

/**
 * Home Component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [NotificationsService],
    standalone: true,
    imports: [
        SearchSuggestComponent,
        NgIf,
        NotificationsServerComponent,
        ServiceAlertComponent,
        CmsBlock2Component,
        CategoriesComponent,
        StatsComponent,
        InstitutionsComponent,
        ApplicationsComponent,
        NewsComponent,
        TranslatePipe,
    ],
})
export class HomeComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Stats subscription of stats component
   */
  statsSubscription: Subscription;

  /**
   * Statistics data  of stats component
   */
  applications: any[];
  stats: any;
  categories: any;
  institutions: any;
  apiError = false;
  cmsSectionOverLatestNewsCb = new BehaviorSubject<IWidget[]>(null);
  cmsSectionOverSearchFieldCb = new BehaviorSubject<IWidget[]>(null);

  /**
   * @ignore
   */
  constructor(
    private seoService: SeoService,
    private api: AbstractService,
    public cmsService: CmsService,
    private applicationsService: ApplicationsService,
  ) {}

  /**
   * Sets META tags (title).
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Menu.Home']);
    this.seoService.setInitialMetaDescription();

    this.statsSubscription = this.api.getRequest(ApiConfig.stats).subscribe(
      data => {
        const { datasets_by_categories, datasets_by_institution, documents_by_type, resources_by_type } = data['meta']['aggs'];

        let stats = documents_by_type.reduce((object, item) => {
          object[item.id] = item;
          return object;
        }, {});
        stats['api'] = resources_by_type.find((item: { [key: string]: string | number }) => item['key'] === 'api');

        if (Object.keys(stats).length < 3) {
          stats = null;
        }

        this.categories = datasets_by_categories.sort((a, b) => a.title.localeCompare(b.title));
        this.institutions = datasets_by_institution.slice(0, 8);
        this.stats = stats;
        this.apiError = false;
      },
      error => (this.apiError = true),
    );

    this.getApplications();
    this.assignCmsSection();
  }

  private getApplications() {
    const params: IHasImageThumbParams = {
      page: 1,
      per_page: 4,
      q: '',
      sort: 'main_page_position',
      has_image_thumb: true,
    };

    return this.applicationsService.getAll(params, { key: 'sort', value: '-modified' }).subscribe(response => {
      this.applications = response.results;
    });
  }

  private assignCmsSection() {
    this.cmsService.getHomePageWidgets().subscribe((response: IHome) => {
      const home = response;
      this.cmsSectionOverLatestNewsCb.next(<IWidget[]>home.over_latest_news_cb);
      this.cmsSectionOverSearchFieldCb.next(<IWidget[]>home.over_search_field_cb);
    });
  }
}

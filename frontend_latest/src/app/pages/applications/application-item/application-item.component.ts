import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApplicationItemResultsComponent } from '../application-item-results/application-item-results.component';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { ApplicationsService } from '@app/services/applications.service';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { SeoService } from '@app/services/seo.service';
import { ArrayHelper } from '@app/shared/helpers';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { KeywordsComponent } from '@app/shared/result-list/related-components/keywords/keywords.component';
import { getEventValue } from '@app/shared/util';

/**
 * Application Item Component
 */
@Component({
    templateUrl: './application-item.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        InfoTooltipDirective,
        KeywordsComponent,
        NotificationsServerComponent,
        NgClass,
        FormsModule,
        NgFor,
        ApplicationItemResultsComponent,
        ItemsPerPageComponent,
        PaginationComponent,
        AsyncPipe,
        TranslatePipe,
        SanitizeHtmlPipe,
        TranslateDateFormatPipe,
    ],
})
export class ApplicationItemComponent implements OnInit, OnDestroy {

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationsService: ApplicationsService,
    private seoService: SeoService,
    private listViewDetailsService: ListViewDetailsService,
  ) {}
  /**
   * Applications subscription of application item component
   */
  private applicationsSubscription: Subscription;

  /**
   * Application  of application item component
   */
  application;

  /**
   * Items (related datasets)
   */
  items: any[] = [];

  /**
   * Count of items (related datasets)
   */
  count: number;

  /**
   * Page setting based on basic params and user interactions
   */
  params: any;

  /**
   * Basic params of application item component
   */
  basicParams = {
    sort: '-verified',
    page: 1,
    q: '',
    per_page: 5,
  };

  /**
   * Sort options
   */
  sortOptions: { labelTranslationKey: string; value: string }[] = [
    { labelTranslationKey: 'Attribute.NameAsc', value: 'title' },
    { labelTranslationKey: 'Attribute.NameDesc', value: '-title' },
    { labelTranslationKey: 'Attribute.UpdateDate', value: '-verified' },
    { labelTranslationKey: 'Attribute.Popularity', value: '-views_count' },
  ];

  /**
   * Determines whether sort value is valid
   */
  isSortValid: boolean;

  /**
   * display category name
   */
  categoryName: string;

  /**
   * icon name based on category
   */
  categoryIcon: string;

  /**
   * show/hide details
   */
  toggleDetails = false;

  /**
   * category name to display in tooltips
   */
  categoryNameForTooltip: string;
  categoryNameForTooltipPlural: string;
  categoryNameForTooltipPluralDataset: string;

  externalDatasets = [];

  protected readonly getValue = getEventValue;

  /**
   * Sets META tags (title, description).
   * Initializes application detail.
   * Initializes and updates list of items (related datasets) on query params change.
   */
  ngOnInit() {
    this.application = this.activatedRoute.snapshot.data['post'];
    this.application.attributes.tags = ArrayHelper.convertArrayValuesToCommaSeparatedString(this.application.attributes.tags);
    this.setCategories();

    this.seoService.setPageTitle(this.application.attributes.title);
    this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.application.attributes.notes));
    this.externalDatasets = this.application.attributes.external_datasets;

    this.applicationsSubscription = this.activatedRoute.queryParamMap
      .pipe(
        switchMap(qParamMap => {
          this.params = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || this.basicParams['sort'],
          };

          return this.applicationsService.getDatasets(this.application.id, this.params);
        }),
      )
      .subscribe(data => {
        const results = data.results ? data.results : [];
        this.items = this.listViewDetailsService.extendViewDetails(results);
        this.count = data.count;
        this.isSortValid = !!this.sortOptions.find(option => option.value === this.params.sort);
      });
  }

  /**
   * Updates query params on every user interaction
   * @param params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
    const updatedBasicParams = {
      page: +this.params['page'] || this.basicParams['page'],
      per_page: +this.params['per_page'] || this.basicParams['per_page'],
      q: this.params['q'] || '',
      sort: this.params['sort'] || '',
    };

    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...params,
      },
      queryParamsHandling: method,
    });
  }

  /**
   * set category name, icon name and names for tooltip based on category
   */
  setCategories() {
    this.categoryName = this.application.attributes.category_name;
    switch (this.application.attributes.category) {
      case 'app':
        this.categoryIcon = 'ic-aplikacje';
        this.categoryNameForTooltip = 'aplikacja';
        this.categoryNameForTooltipPlural = 'aplikacji';
        this.categoryNameForTooltipPluralDataset = 'aplikacji';
        break;
      case 'www':
        this.categoryIcon = 'ic-portal-www';
        this.categoryNameForTooltip = 'serwis www';
        this.categoryNameForTooltipPlural = 'serwisu';
        this.categoryNameForTooltipPluralDataset = 'serwisie www';
        break;
      case 'other':
        this.categoryIcon = 'ic-inne';
        this.categoryNameForTooltip = 'inne';
        this.categoryNameForTooltipPlural = 'inne';
        this.categoryNameForTooltipPluralDataset = 'inne';
        break;
    }
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.applicationsSubscription.unsubscribe();
  }
}

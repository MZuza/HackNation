import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';

import { toggleVertically } from '@app/animations';
import { DatasetService } from '@app/services/dataset.service';
import { BasicPageParams } from '@app/services/models/page-params';
import { SeoService } from '@app/services/seo.service';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { NewDataContactComponent } from '@app/shared/new-data-contact/new-data-contact.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  animations: [toggleVertically],
  standalone: true,
  imports: [
    TranslatePipe,
    NgIf,
    NotificationsServerComponent,
    NoResultsFoundComponent,
    ResultListComponent,
    RouterLink,
    SanitizeHtmlPipe,
    TranslateDateFormatPipe,
    AsyncPipe,
    ItemsPerPageComponent,
    PaginationComponent,
    NewDataContactComponent
  ]
})
export class SubmissionListComponent implements OnInit {
  /**
   * Items to display on the list
   */
  items: any;

  /**
   * Total items count
   */
  count: number;

  /**
   * Basic params of the component
   */
  basicParams: BasicPageParams = {
    page: 1,
    per_page: 5,
    sort: '-published_at',
  };

  /**
   * User defined params
   */
  params: BasicPageParams;
  numPages: any;

  /**
   * @ignore
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private datasetService: DatasetService,
  ) {}

  /**
   * Updates query params on every user interaction
   * @param {any} params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
    const updatedBasicParams = {
      page: +this.params['page'] || this.basicParams['page'],
      per_page: +this.params['per_page'] || this.basicParams['per_page'],
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
   * Handles activated route params change
   */
  private handleActivatedRouteParams() {
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap(qParamMap => {
          this.params = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            sort: this.basicParams['sort'],
          };

          return this.datasetService.getSubmissions(this.params);
        }),
      )
      .subscribe(response => {
        this.items = response.results;
        this.count = response.count;
      });
  }

  /**
   * Sets META tags.
   * Handles route params changes.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['DataProposal.Self']);
    this.handleActivatedRouteParams();
  }
}

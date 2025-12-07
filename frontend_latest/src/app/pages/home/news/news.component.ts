import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { CmsService } from '@app/services/cms.service';
import { NotificationsService } from '@app/services/notifications.service';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { StripHtmlPipe } from '@app/shared/pipes/strip-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { TruncateTextPipe } from '@app/shared/pipes/truncate-text.pipe';

/**
 * News Component
 */
@Component({
    selector: 'home-news',
    templateUrl: './news.component.html',
    providers: [NotificationsService],
    standalone: true,
  imports: [
    NotificationsServerComponent,
    NgFor,
    RouterLink,
    FooterComponent,
    AsyncPipe,
    TranslatePipe,
    StripHtmlPipe,
    TruncateTextPipe,
    TranslateDateFormatPipe,
    LocalizeRouterPipe,
    SanitizeHtmlPipe,
  ],
})
export class NewsComponent implements OnInit, OnDestroy {
  /**
   * Articles substription of news component
   */
  articlesSubstription: Subscription;

  /**
   * Items (articles) of news component
   */
  items;

  /**
   * @ignore
   */
  constructor(private notificationsService: NotificationsService, private cmsService: CmsService) {}

  /**
   * Initializes list of items (articles from one category - news).
   */
  ngOnInit() {
    this.articlesSubstription = this.cmsService
      .getAllNewsWidgets({
        children_page: 1,
        children_per_page: 3,
        children_sort: '-first_published_at',
        children_extra_fields: 'body,author,tags',
      })
      .subscribe(news => (this.items = news.data));
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.articlesSubstription.unsubscribe();
  }
}

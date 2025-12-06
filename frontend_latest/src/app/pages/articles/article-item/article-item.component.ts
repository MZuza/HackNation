import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SeoService } from '@app/services/seo.service';
import { ArrayHelper } from '@app/shared/helpers';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { KeywordsComponent } from '@app/shared/result-list/related-components/keywords/keywords.component';

/**
 * Article Item Component
 */
@Component({
    templateUrl: './article-item.component.html',
    standalone: true,
    imports: [
        NgIf,
        KeywordsComponent,
        NotificationsServerComponent,
        AsyncPipe,
        TranslatePipe,
        SanitizeHtmlPipe,
        TranslateDateFormatPipe,
    ],
})
export class ArticleItemComponent implements OnInit {
  /**
   * Article of article item component
   */
  article;

  /**
   * @ignore
   */
  constructor(private activatedRoute: ActivatedRoute, private seoService: SeoService) {}

  /**
   * Sets META tags (title, description).
   * Initializes article.
   */
  ngOnInit() {
    this.article = this.activatedRoute.snapshot.data['post'];
    this.article.attributes.tags = ArrayHelper.convertArrayValuesToCommaSeparatedString(this.article.attributes.tags);

    this.seoService.setPageTitle(this.article.attributes.title);
    this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.article.attributes.notes));
  }
}

import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ArrayHelper } from '@app/shared/helpers';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { StripHtmlWithExceptionPipe } from '@app/shared/pipes/strip-html-with-exception';

/**
 * Component which displays key words
 */
@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html',
    standalone: true,
    imports: [
        NgIf,
        TranslatePipe,
        SanitizeHtmlPipe,
        StripHtmlWithExceptionPipe,
    ],
})
export class KeywordsComponent {
  /**
   * Text representation of tags
   */
  text: string;

  /**
   * builds keywords string from all keywords
   * @param {string []} tags
   */
  @Input() set tags(tags: string[]) {
    this.text = ArrayHelper.convertArrayValuesToCommaSeparatedString(tags);
  }
}

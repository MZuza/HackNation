import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StringHelper } from '../helpers/string.helper';
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';

import { toggleVertically } from '@app/animations';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Truncated text component with expand/ collapse button
 */
@Component({
    selector: 'collapsible-text',
    templateUrl: './collapsible-text.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        TranslatePipe,
        SanitizeHtmlPipe,
        TruncateTextPipe,
    ],
})
export class CollapsibleTextComponent {
  /**
   * Text do display
   */
  @Input() text: string;

  /**
   * Text do display
   */
  @Input() tags: any;

  /**
   * Truncated text length
   */
  @Input() maxTextLength = 400;

  @Input() isCollapsedDown = false;

  /**
   * Is text collapsed
   */
  isCollapsed = true;

  /**
   * Is notes collapsed
   */
  isCollapsedNotes = false;

  /**
   * Random id
   */
  generatedId = StringHelper.generateRandomHex();
}

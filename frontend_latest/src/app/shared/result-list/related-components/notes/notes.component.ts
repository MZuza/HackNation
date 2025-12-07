import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TruncateTextPipe } from '../../../pipes/truncate-text.pipe';

import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { StripHtmlWithExceptionPipe } from '@app/shared/pipes/strip-html-with-exception';

/**
 * Component which displays notes
 */
@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrl: './notes.component.scss',
    standalone: true,
    imports: [
        NgIf,
        SanitizeHtmlPipe,
        StripHtmlWithExceptionPipe,
        TruncateTextPipe,
    ],
})
export class NotesComponent {
  /**
   * notes data to display
   */
  @Input() notes: string;
}

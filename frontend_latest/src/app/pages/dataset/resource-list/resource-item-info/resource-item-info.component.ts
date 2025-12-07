import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { StripHtmlWithExceptionPipe } from '@app/shared/pipes/strip-html-with-exception';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

@Component({
  selector: 'app-resource-item-info',
  templateUrl: './resource-item-info.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    StripHtmlWithExceptionPipe,
    SanitizeHtmlPipe,
    TranslatePipe,
    NgOptimizedImage,
    TooltipDirective,
    TranslateDateFormatPipe,
    AsyncPipe
  ]
})
export class ResourceItemInfoComponent {
  /**
   * dataset item to display
   */
  @Input() item: any;

  /**
   * determines if created sort param is active
   */
  @Input() isSortParamsCreated = false;

  /**
   * determines if data date sort param is active
   */
  @Input() isSortParamsDataDate = false;

  /**
   * url to compose router link
   */
  @Input() urlNavigation: string;
}

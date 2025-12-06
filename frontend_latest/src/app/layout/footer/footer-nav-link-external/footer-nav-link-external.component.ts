import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Footer Nav Link External Component
 */
@Component({
  selector: '[app-footer-nav-link-external]',
  templateUrl: './footer-nav-link-external.component.html',
  imports: [
    TranslatePipe
  ],
  standalone: true
})
export class FooterNavLinkExternalComponent {
  /**
   * External link
   */
  @Input() link: string;

  /**
   * Label translation key
   */
  @Input() labelTranslationKey: string;
}

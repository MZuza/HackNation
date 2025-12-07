import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Footer Nav Link Internal Component
 */
@Component({
  selector: '[app-footer-nav-link-internal]',
  templateUrl: './footer-nav-link-internal.component.html',
  imports: [
    NgIf,
    RouterLink,
    LocalizeRouterPipe,
    RouterLinkActive,
    TranslatePipe
  ],
  standalone: true
})
export class FooterNavLinkInternalComponent {
  /**
   * Internal link
   */
  @Input() link: string;

  /**
   * Label translation key
   */
  @Input() labelTranslationKey: string;

  /**
   * Href attribute
   * @type {string}
   */
  @Input() href: string;
}

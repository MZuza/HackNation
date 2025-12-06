import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { FooterComponent } from '@app/shared/footer/footer.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Institutions Component
 */
@Component({
    selector: 'home-institutions',
    templateUrl: './institutions.component.html',
    standalone: true,
  imports: [
    InfoTooltipDirective,
    NgIf,
    NgFor,
    RouterLink,
    FooterComponent,
    TranslatePipe,
    LocalizeRouterPipe,
    SanitizeHtmlPipe,
  ],
})
export class InstitutionsComponent {

    /**
     * Items (institutions) of institutions component
     */
    @Input() items;
}

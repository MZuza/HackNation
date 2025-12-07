import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { FooterComponent } from '@app/shared/footer/footer.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Applications Component
 */
@Component({
    selector: 'home-applications',
    templateUrl: './applications.component.html',
    standalone: true,
  imports: [InfoTooltipDirective, NgIf, NgFor, RouterLink, FooterComponent, TranslatePipe, LocalizeRouterPipe, SanitizeHtmlPipe]
})
export class ApplicationsComponent {

    /**
     * data (applications) of applications component
     */
    @Input() applications: any[];
}

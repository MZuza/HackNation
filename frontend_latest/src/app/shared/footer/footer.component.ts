import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Categories Component
 */
@Component({
    selector: 'home-section-footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [RouterLink, TranslatePipe, LocalizeRouterPipe]
})
export class FooterComponent {

    /**
     * Router url
     */
    @Input() routerURL: string;

    /**
     * Link test
     */
    @Input() text: string;
}

import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipDirective } from '../tooltip/tooltip.directive';

/**
 * Result item for component with files
 */
@Component({
    selector: 'app-new-data-contact',
    templateUrl: './new-data-contact.component.html',
    standalone: true,
    imports: [
        TooltipDirective,
        RouterLink,
        TranslatePipe,
    ],
})
export class NewDataContactComponent {
  @Input() buttonTranslationKey: string;
  @Input() routerLink: string;
  @Input() titleTranslationKey: string;
}

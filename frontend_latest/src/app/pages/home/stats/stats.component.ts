import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Stats Component
 */
@Component({
    selector: 'home-stats',
    templateUrl: './stats.component.html',
    standalone: true,
    imports: [NgIf, TranslatePipe]
})
export class StatsComponent {

    /**
     * Statistics data  of stats component
     */
    @Input() stats: any;
}

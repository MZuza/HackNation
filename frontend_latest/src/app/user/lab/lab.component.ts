import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-lab',
    templateUrl: './lab.component.html',
    standalone: true,
    imports: [
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        TranslatePipe,
    ],
})
export class LabComponent {}

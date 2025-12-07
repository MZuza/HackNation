import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-followed-object-tabs',
    templateUrl: './followed-object-tabs.component.html',
    standalone: true,
    imports: [
        RouterLinkActive,
        NgClass,
        RouterLink,
        RouterOutlet,
        TranslatePipe,
    ],
})
export class FollowedObjectTabsComponent implements OnInit {

    /**
     * Id of the corresponding tab
     */
    labelledBy: string;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute) {}

    /**
     * Sets aria label
     */
    ngOnInit() {
        this.labelledBy = this.activatedRoute.snapshot.data['labelledBy'];
    }
}


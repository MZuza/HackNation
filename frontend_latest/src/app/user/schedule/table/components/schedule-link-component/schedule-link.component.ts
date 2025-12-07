import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { StringHelper } from '@app/shared/helpers/string.helper';
import { ScheduleTableAction } from '@app/user/schedule/table/domain/schedule-table.action';

/**
 * Schedule Link Component
 */
@Component({
    selector: 'app-schedule-link',
    templateUrl: './schedule-link.component.html',
    standalone: true,
    imports: [RouterLink, TranslatePipe],
})
export class ScheduleLinkComponent implements ScheduleTableAction, OnInit {

    /**
     * Url
     * @type {string}
     */
    @Input()
    url: string;

    /**
     * Icon Name
     * @type {string}
     */
    @Input()
    iconName: string;

    /**
     * Title
     * @type {string}
     */
    @Input()
    titleTranslationKey: string;

    /**
     * Class name
     * @type {string}
     */
    @Input()
    className: string;

    /**
     * Unique id
     */
    generatedId = StringHelper.generateRandomHex();

    /**
     * @ignore
     */
    constructor(private readonly router: Router) {
    }

    /**
     * Setups url
     */
    ngOnInit() {
        this.url = this.router.url + this.url;
    }
}

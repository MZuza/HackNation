import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LinkHelper } from '../helpers';
import { TooltipDirective } from '../tooltip/tooltip.directive';

/**
 * API source link
 * @example
 * <app-api-source-link [apiUrl]="selfApi"></app-api-source-link>
 */
@Component({
    selector: 'app-api-source-link',
    templateUrl: './api-source-link.component.html',
    standalone: true,
    imports: [NgIf, NgClass, TooltipDirective, TranslatePipe]
})
export class ApiSourceLinkComponent implements OnChanges {

    /**
     * Determines API URL
     * @type {string}
     */
    @Input() apiUrl: string;

    /**
     * custom css class for styling
     * @type {string}
     */
    @Input() customCssClass: string;

    /**
     * @ignore
     */
    constructor(private translate: TranslateService) {
    }

    /**
     * Sets additional 'lang' param when apiURL changed
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.apiUrl) {
            if (changes.apiUrl.currentValue !== changes.apiUrl.previousValue) {
                this.updateQueryParamsWithLanguage();
            }
        }
    }

    /**
     * Updates query params with language
     */
    private updateQueryParamsWithLanguage(): void {
        if (!this.apiUrl) {
            return;
        }

        const lang = 'lang';
        const apiUrlArray = this.apiUrl.split('?');

        if (apiUrlArray.length > 1) {
            const queryParams = LinkHelper.parseQueryString(apiUrlArray[1]);

            if (lang in queryParams) {
                return;
            }
            this.apiUrl += `&${lang}=${this.translate.currentLang}`;
        } else {
            this.apiUrl += `?${lang}=${this.translate.currentLang}`;
        }
    }
}

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2, TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { toggleVertically } from '@app/animations';
import { APP_CONFIG } from '@app/app.config';
import { ApiModel } from '@app/services/api/api-model';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { SearchSuggestListboxOption } from '@app/shared/search-suggest/search-suggest';
import { ScheduleSearchSuggestListboxOption } from '@app/user/schedule/tabs/planning/components/search-suggest/ScheduleSearchSuggestListboxOption';
import { SchedulePlanningService } from '@app/user/schedule/tabs/planning/schedule-planning.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TranslatePipe } from '@ngx-translate/core';


/**
 * Schedule Search Suggest Component
 *
 */
@Component({
    selector: 'app-schedule-search-suggest',
    templateUrl: './schedule-search-suggest.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [NgIf, CdkTrapFocus, NgFor, NgClass, TranslatePipe]
})
export class ScheduleSearchSuggestComponent implements OnInit, OnDestroy {
    /**
     * Router endpoints
     */
    readonly routerEndpoints = RouterEndpoints;
    /**
     * Determines api models of data to search within
     */
    @Input() apiModels: ApiModel[] = [];
    /**
     * Determines max search results per one model
     */
    @Input() maxResultsPerModel = 1;
    /**
     * Search results url
     */
    @Input() searchResultsUrl = '/search';
    /**
     * Enables manual mode.
     * Auto mode - updates query params on search and clear.
     * Manual mode - returns data on search and clear.
     */
    @Input() useTriggers = true;

    /**
     * Id of element that should be excluded from search results
     */
    @Input() elementToExcludeId: number;
    /**
     * Emits new value on search
     */
    @Output() searchTrigger = new EventEmitter<{ [key: string]: string }>();
    /**
     * Reference to the search query input
     */
    @ViewChild('q', {read: ElementRef}) queryInputRef: ElementRef;
    /**
     * Button ref
     * @type {ElementRef}
     */
    @ViewChild('buttonRef', {read: ElementRef}) buttonRef: ElementRef;
    /**
     * Listbox template
     * @type {TemplateRef<unknown>}
     */
    @ViewChild('templatePortalContent') templatePortalContent: TemplateRef<unknown>;
    /**
     * Min number of characters to perfmorm search
     */
    minChars = 2;
    /**
     * Max number of characters to perfmorm search
     */
    maxChars = APP_CONFIG.searchInputMaxLength;
    /**
     * Listbox options - suggestion list
     */
    listBoxOptions: ScheduleSearchSuggestListboxOption[] = [];
    /**
     * Determines whether listbox (suggestion list) is expanded
     */
    isListBoxExpanded = false;
    /**
     * Default index of the suggestion list
     */
    notSelectedSuggestionIndex = -1;
    /**
     * Active listbox index of the suggestion list
     */
    activeSuggestionIndex = this.notSelectedSuggestionIndex;
    /**
     * Determines invalid search query
     */
    isSearchQueryInvalid: boolean;
    /**
     * Unique id
     */
    generatedId = StringHelper.generateRandomHex();

    /**
     * Listens on events outside suggestions component
     */
    private clickOutsideListener: () => void;

    /**
     * Lisbox Items
     * @type {ScheduleSearchSuggestListboxOption[]}
     */
    private items: ScheduleSearchSuggestListboxOption[] = [];
    /**
     * Overlay ref
     * @type {OverlayRef}
     */
    private overlayRef: OverlayRef;

    /**
     * Backdrop click listener
     * @type {Subscription}
     */
    private backdropClick$: Subscription;

    /**
     * Focus timeout reference
     * @type {number}
     */
    private focusTimeout: ReturnType<typeof setTimeout>;

    /**
     * @ignore
     */
    constructor(private renderer: Renderer2,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private schedulePlanningService: SchedulePlanningService,
                private localizeRouterService: LocalizeRouterService,
                private viewContainerRef: ViewContainerRef,
                private elementRef: ElementRef,
                private overlay: Overlay) {
    }

    /**
     * Search query
     */
    private _searchText: string;

    get searchText(): string {
        return this._searchText;
    }

    @Input('searchQuery') set searchText(value: string) {
        this._searchText = value.trim();
    }

    /**
     * Listens on search query changes.
     * Conditionally toggles dropdown.
     */
    ngOnInit() {
        if (!this.apiModels || (this.apiModels && !this.apiModels.length)) {
            return;
        }

        // this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
    }

    /**
     * Populates suggestions list.
     * Toggles suggestions list.
     * Resets active descendant index.
     * @param {SearchSuggestListboxOption[]} [items]
     */
    toggleDropdown(items: ScheduleSearchSuggestListboxOption[] = []) {
        this.listBoxOptions = [...items];
        this.setListboxVisibility(true);
        this.activeSuggestionIndex = this.notSelectedSuggestionIndex;
    }

    /**
     * Creates listbox option from a data item of the api response
     * @param {any} item
     * @param schedules
     * @returns {ScheduleSearchSuggestListboxOption} listbox option from item
     */
    createListboxOptionFromItem(item: any, schedules: Array<any>): ScheduleSearchSuggestListboxOption {
        const {dataset_title: title}: { dataset_title: string } = item.attributes;
        const {id: scheduleId} = item.relationships.schedule.data;
        const {id: userScheduleId} = item.relationships.user_schedule.data;
        const schedule = schedules.find(foundSchedule => foundSchedule.id === scheduleId);
        const {period_name, state} = schedule.attributes;
        return {
            title: title,
            url: this.getUrl(state, scheduleId, item.id, userScheduleId),
            period: period_name
        };
    }

    /**
     * Parses knowledge base url
     * @param {string} htmlUrl
     * @returns {string}
     */
    parseKnowledgeBaseUrl(htmlUrl: string) {
        const slashLastIndex = htmlUrl.lastIndexOf('/');
        const kbUrl = (slashLastIndex === htmlUrl.length - 1) ? htmlUrl.substr(0, htmlUrl.length - 1) : htmlUrl;
        const kbIndex = kbUrl.indexOf(`/${this.routerEndpoints.KNOWLEDGE_BASE}`);
        return kbUrl.substr(kbIndex);
    }

    /**
     * Prepares listbox options
     * @param {any[]} responseData
     * @returns {ScheduleSearchSuggestListboxOption[]} listbox options
     */
    prepareListboxOptions(response: any): ScheduleSearchSuggestListboxOption[] {
        const {data: responseData, included: schedules} = response;
        return responseData.map(item => {
            return this.createListboxOptionFromItem(item, schedules);
        });
    }

    /**
     * Initializes and displays suggestion list.
     * Redirects user to a search results route base on a condition.
     * Toggles error message.
     * Returns query params in non auto mode (useTriggers=true)
     */
    onSearch() {
        if (this.items.length > 0) {
            this.toggleDropdown(this.items);
        } else {

            this.schedulePlanningService.searchForUserSchedules(this.searchText, this.elementToExcludeId).subscribe(response => {
                if (!response || !response['data']) {
                    return;
                }

                this.items = this.prepareListboxOptions(response);
                this.toggleDropdown(this.items);
            });
        }

        const q = this.searchText;
        this.isSearchQueryInvalid = !q || (q && q.length < this.minChars);

        if (this.isSearchQueryInvalid) {
            return;
        }

        if (this.activeSuggestionIndex !== this.notSelectedSuggestionIndex) {
            this.onActiveSuggestionClick();
        } else {
            const queryParams = this.prepareQueryParams({q});

            if (this.useTriggers) {
                this.searchTrigger.emit(queryParams);
            } else {
                this.updateParamsOrRedirect(this.searchResultsUrl, queryParams);
            }
        }
    }

    /**
     * Prepares query params
     * @param {[key: string]: string} queryParams
     * @returns {[key: string]: string}
     */
    prepareQueryParams(queryParams: { [key: string]: string }): { [key: string]: string } {
        return queryParams;
    }

    /**
     * Navigates to the same or specified URL.
     * Updates query params.
     * Redirects to a main search if more than 1 apiModel specified.
     * @param {string} url
     * @param {[key: string]: string} queryParams
     */
    updateParamsOrRedirect(url: string, queryParams: { [key: string]: string }) {
        this.router.navigate([url], {
            queryParams: queryParams,
            queryParamsHandling: 'merge',
            relativeTo: this.activatedRoute
        });
    }

    /**
     * Sets next index on the list as active
     */
    setNextActiveSuggestionIndex() {
        if (this.activeSuggestionIndex === this.notSelectedSuggestionIndex) {
            this.activeSuggestionIndex = 0;
        } else if (this.activeSuggestionIndex === this.listBoxOptions.length - 1) {
            this.activeSuggestionIndex = this.notSelectedSuggestionIndex;
        } else {
            this.activeSuggestionIndex++;
        }
    }

    /**
     * Sets previous index on the list as active
     */
    setPreviousActiveSuggestionIndex() {
        if (this.activeSuggestionIndex === this.notSelectedSuggestionIndex) {
            this.activeSuggestionIndex = this.listBoxOptions.length - 1;
        } else if (this.activeSuggestionIndex === 0) {
            this.activeSuggestionIndex = this.notSelectedSuggestionIndex;
        } else {
            this.activeSuggestionIndex--;
        }
    }

    /**
     * Enables keyboard navigation.
     * Performs actions on keyboard events.
     * @param {KeyboardEvent} event
     */
    onKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                this.setNextActiveSuggestionIndex();
                break;

            case 'ArrowUp':
                this.setPreviousActiveSuggestionIndex();
                break;

            case 'Enter':
                this.onActiveSuggestionClick();
                break;

            case 'Tab':
                this.setListboxVisibility(false);
                break;

            case 'Space':
                if (event.shiftKey) {
                    this.setListboxVisibility(true);
                    event.preventDefault();
                }
                break;

            case 'Escape':
                this.setListboxVisibility(false);
        }
    }

    /**
     * Navigates to a details of the active item on the suggestion list
     */
    onActiveSuggestionClick() {
        this.close();
        if (this.activeSuggestionIndex === this.notSelectedSuggestionIndex) {
            return;
        }

        const listboxOption = this.listBoxOptions[this.activeSuggestionIndex];
        this.router.navigate([listboxOption.url]);
    }

    /**
     * Listens on click outside query input. Hides suggestions list.
     * @param {Event} event
     */
    clickOutside(event: Event) {
        const targetElement = event.target as HTMLElement;
        const parentElement = this.queryInputRef.nativeElement as HTMLElement;
        const parentButton = this.buttonRef.nativeElement as HTMLElement;
        const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1 ||
            parentButton.outerHTML.indexOf(targetElement.outerHTML) !== -1;

        if (!clickedInside) {
            this.setListboxVisibility(false);
        }
    }

    /**
     * Destroys unnecessary listeners
     */
    ngOnDestroy() {
        if (this.clickOutsideListener instanceof Function) {
            this.clickOutsideListener();
          if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
          }
        }
    }

    /**
     * Gets url to navigate
     * @param state
     * @param scheduleId
     * @param userScheduleItemId
     * @param userScheduleId
     * @returns {string}
     */
    private getUrl(state: string, scheduleId: string, userScheduleItemId: string, userScheduleId: string): string {
        if (state !== 'planned') {
            const scheduleType = state === 'implemented' ? 'in-progress' : 'archive';
            return `${this.localizeRouterService.translateRoute('/')
            }/user/dashboard/schedule/${scheduleType}/${scheduleId}/representative/${userScheduleId}/edit/${userScheduleItemId}`;
        }
        return `${this.localizeRouterService.translateRoute('/')
        }/user/dashboard/schedule/planning/representative/${userScheduleId}/edit/${userScheduleItemId}`;
    }

    /**
     * Sets Listbox visibility
     * @param isVisible
     */
    private setListboxVisibility(isVisible: boolean): void {
        if (isVisible) {
            const templatePortal = new TemplatePortal(
                this.templatePortalContent,
                this.viewContainerRef
            );
            const flexibleConnectedPositionStrategy = this.overlay.position().flexibleConnectedTo(this.elementRef)
                .withPositions([{
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'top'
                }]);
            const blockScrollStrategy = this.overlay.scrollStrategies.block();
            this.overlayRef = this.overlay.create({
                positionStrategy: flexibleConnectedPositionStrategy,
                width: '240px',
                minHeight: '30px',
                maxHeight: '120px',
                scrollStrategy: blockScrollStrategy,
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-transparent-backdrop'
            });
            this.overlayRef.attach(templatePortal);
            this.focusTimeout = setTimeout(() => {
                this.overlayRef.hostElement.querySelector<HTMLElement>('.search-suggest__listbox').focus();
            });
            this.backdropClick$ = this.overlayRef.backdropClick()
                .pipe(take(1))
                .subscribe(() => {
                    this.close();
                });
        } else {
            this.close();
        }
    }

    /**
     * Closes listbox
     */
    private close(): void {
        this.overlayRef.dispose();
        this.backdropClick$.unsubscribe();
    }
}

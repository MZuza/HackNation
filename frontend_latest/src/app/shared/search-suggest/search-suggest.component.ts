import { DOCUMENT, Location, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { LocalizeRouterPipe, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StringHelper } from '../helpers/string.helper';
import { InfoTooltipDirective } from '../info-tooltip/info-tooltip.directive';
import { KeyvalueOrderPipe } from '../pipes/keyvalue-order.pipe';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { SearchAdvancedSettings, SearchSuggestListboxOption, SearchSuggestRegionListboxOption } from './search-suggest';

import { toggleVertically } from '@app/animations';
import { APP_CONFIG } from '@app/app.config';
import { ApiModel } from '@app/services/api/api-model';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SearchSuggestionsService } from '@app/services/search-suggestions.service';
import { ObjectHelper } from '@app/shared/helpers';

/**
 * Search Suggest Component
 *
 *  @example auto mode - updates query params
 *  <app-search-suggest
        [placeholderTranslationKey]="'Datasets.SearchFor'"
        [searchQuery]="'otwarte dane'"
        [searchResultsUrl]="'.'"
        [apiModels]="[apiModel.APPLICATION, apiModel.ARTICLE, apiModel.DATASET, apiModel.INSTITUTION, apiModel.KNOWLEDGE_BASE, apiModel.RESOURCE]"
        [maxResultsPerModel]="2"
        [showAdvancedSettings]="true">
    </app-search-suggest>
 *
 *  @example manual mode - returns query params
 *  <app-search-suggest
        [placeholderTranslationKey]="'Datasets.SearchFor'"
        [searchQuery]="'otwarte dane'"
        [apiModels]="[apiModel.APPLICATION, apiModel.ARTICLE, apiModel.DATASET, apiModel.INSTITUTION, apiModel.KNOWLEDGE_BASE, apiModel.RESOURCE]"
        [maxResultsPerModel]="2"
        [showAdvancedSettings]="true"
        [useTriggers]="true"
        (searchTrigger)="performSearch({q: $event.q, advanced: $event.advanced, sort: 'relevance'})"
        (clearTrigger)="updateParams({q: '', advanced: $event.advanced, sort: ''})">
    </app-search-suggest>
 */
@Component({
    selector: 'app-search-suggest',
    templateUrl: './search-suggest.component.html',
    animations: [toggleVertically],
    standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgFor,
    NgClass,
    InfoTooltipDirective,
    RouterLink,
    TooltipDirective,
    TitleCasePipe,
    TranslatePipe,
    LocalizeRouterPipe,
    KeyvalueOrderPipe,
    SanitizeHtmlPipe,
  ],
})
export class SearchSuggestComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Emits new search value on search query change
   */
  searchTextChanged = new Subject<string>();

  /**
   * Emits new value after search text is cleared
   */
  searchTextCleared = new Subject<boolean>();

  /**
   * Search query placeholder and aria label text
   */
  @Input('placeholderTranslationKey') placeholderTranslationKey = 'Home.Search.PlaceholderText';

  /**
   * Search query
   */
  private _searchText: string;

  /**
   * Tooltip color
   * @type {string}
   */
  tooltipColor: string;

  /**
   * Tooltip text
   * @type {string}
   */
  @Input() tooltipText: string;

  get searchText(): string {
    return this._searchText;
  }

  @Input('searchQuery') set searchText(value: string) {
    this._searchText = decodeURIComponent(value.trim());
    this.searchTextChanged.next(this.searchText);
  }

  /**
   * initial value for region input (after refresh if exists)
   */
  @Input() initialValue;

  /**
   * Determines api models of data to search within
   */
  @Input() apiModels: ApiModel[] = [];

  /**
   * Determines max search results per one model
   */
  @Input() maxResultsPerModel = 1;

  /**
   * Determines wether search advanced settings are visible
   */
  @Input() showAdvancedSettings = false;

  /**
   * Search results url
   */
  @Input() searchResultsUrl = '/!search';

  /**
   * Enables manual mode.
   * Auto mode - updates query params on search and clear.
   * Manual mode - returns data on search and clear.
   */
  @Input() useTriggers = false;

  /**
   * Search query results tooltip text
   * @type {string}
   */
  @Input() searchQueryRulesTooltipText: string;

  /**
   * Active advanced setting
   */
  @Input('advancedSetting') activeSetting = SearchAdvancedSettings.ANY;

  /**
   * Sparql button visibility flag
   */
  @Input() isSparqlSearchButtonVisible: boolean;

  /**
   * API validation button visibility flag
   */
  @Input() isApiValidationButtonVisible: boolean;

  /**
   * Emits new value on search
   */
  @Output() searchTrigger = new EventEmitter<{ [key: string]: string }>();

  /**
   * Emits new value on clear
   */
  @Output() clearTrigger = new EventEmitter<{ [key: string]: string }>();

  /**
   * Emits click event to move into search results for screen reader
   */
  @Output() moveToSearchResultTrigger = new EventEmitter();

  @Input() isGeodataSearch = false;

  @Output() regionListboxOption = new EventEmitter<SearchSuggestRegionListboxOption>();

  /**
   * Reference to the search query input
   */
  @ViewChild('q', { read: ElementRef }) queryInputRef: ElementRef;

  /**
   * Listens on events outside suggestions component
   */
  private clickOutsideListener: () => void;

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
  listBoxOptions = [];

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
   * Search advanced settings
   */
  searchAdvancedSettings = SearchAdvancedSettings;

  /**
   * validation API url
   */
  apiValidationUrl: string;

  /**
   * @ignore
   */
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private searchSuggestionsService: SearchSuggestionsService,
    private localize: LocalizeRouterService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: any,
  ) {}

  /**
   * Listens on search query changes.
   * Conditionally toggles dropdown.
   */
  ngOnInit() {
    if (!this.apiModels || (this.apiModels && !this.apiModels.length)) {
      return;
    }

    this.tooltipColor = this.location.path().split('/').length === 2 ? '#fff' : undefined;

    this.searchTextChanged
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        switchMap((changedPhrase: string) => {
          this.toggleDropdown();

          if (!changedPhrase || (changedPhrase && changedPhrase.length < this.minChars)) {
            return of(null);
          }

          return this.searchSuggestionsService.getSuggestions(changedPhrase, this.apiModels, this.maxResultsPerModel);
        }),
      )
      .subscribe(response => {
        if (!response || response['data'].length === 0) {
          if (this.apiModels[0] === 'region') {
            this.regionListboxOption.emit(null);
            return;
          } else {
            return;
          }
        }
        this.toggleDropdown(this.prepareListboxOptions(response['data']));
      });

    this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));

    const hostname = this.document.location.hostname.replace('www.', '');
    switch (hostname) {
      case 'localhost':
        this.apiValidationUrl = `https://dev.dane.gov.pl/tools/api-validator`;
        break;
      default:
        this.apiValidationUrl = `https://${this.document.location.hostname.replace('www.', '')}/tools/api-validator`;
        break;
    }
  }

  /**
   * Emits an event after search input is cleared
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    const { searchText } = changes;
    const isSearchTextEmpty = searchText && searchText.previousValue && !searchText.currentValue;
    this.searchTextCleared.next(isSearchTextEmpty);
  }

  /**
   * Sets focus after search input is cleared
   */
  ngAfterViewInit() {
    this.searchTextCleared.subscribe(isSearchTextEmpty => {
      if (isSearchTextEmpty) {
        (<HTMLInputElement>this.queryInputRef.nativeElement).focus();
      }
    });
  }

  /**
   * Populates suggestions list.
   * Toggles suggestions list.
   * Resets active descendant index.
   * @param {SearchSuggestListboxOption[]} [items]
   */
  toggleDropdown(items = []) {
    this.listBoxOptions = [...items];
    this.isListBoxExpanded = !!items.length;
    this.activeSuggestionIndex = this.notSelectedSuggestionIndex;
  }

  /**
   * Creates listbox option from a data item of the api response
   * @param {any} item
   * @returns {SearchSuggestListboxOption} listbox option from item
   */
  createListboxOptionFromItem(item: any): SearchSuggestListboxOption | SearchSuggestRegionListboxOption {
    const { title, model, slug }: { title: string; model: ApiModel; slug: string } = item.attributes;
    const id: string = item.id.indexOf('-') !== -1 ? item.id.split('-')[1] : item.id;
    const updatedModel = model.replace('_', '-');

    let url = `/${updatedModel}`;
    let areaTranslationKey = `${StringHelper.capitalizeFirstLetter(updatedModel)}s.Self`;

    switch (model) {
      case ApiModel.ARTICLE:
        areaTranslationKey = 'Articles.News';
        break;
      case ApiModel.KNOWLEDGE_BASE:
        areaTranslationKey = `${StringHelper.capitalizeFirstLetter(StringHelper.toCamelCase(updatedModel))}.Self`;
        url = this.parseKnowledgeBaseUrl(item.attributes.html_url);
        break;
      case ApiModel.NEWS:
        url = `/article/${slug}`;
        areaTranslationKey = 'Articles.News';
        break;
      case ApiModel.RESOURCE:
        const relatedType: string = ObjectHelper.getNested(item, ['relationships', 'dataset', 'data', 'type']);
        const relatedTypeApiUrl: string = ObjectHelper.getNested(item, ['relationships', 'dataset', 'links', 'related']);
        if (relatedType && relatedTypeApiUrl) {
          const relatedTypeApiUrlArray = relatedTypeApiUrl.split('/');
          const relatedTypeUrlPart = relatedTypeApiUrlArray[relatedTypeApiUrlArray.length - 1];
          url = `/${relatedType}/${relatedTypeUrlPart}/${updatedModel}`;
        }
        break;
      case ApiModel.SHOWCASE:
        areaTranslationKey = 'Menu.Showcases';
        break;
    }

    if (this.isGeodataSearch) {
      return {
        bbox: item.attributes.bbox,
        hierarchy_label: item.attributes.hierarchy_label,
        region_id: item.attributes.region_id,
        title: title,
        areaTranslationKey: areaTranslationKey,
      };
    } else {
      return {
        title: title,
        url: model === ApiModel.KNOWLEDGE_BASE || model === ApiModel.NEWS ? url : (url += `/${id},${slug}`),
        areaTranslationKey: areaTranslationKey,
      };
    }
  }

  /**
   * Parses knowledge base url
   * @param {string} htmlUrl
   * @returns {string}
   */
  parseKnowledgeBaseUrl(htmlUrl: string) {
    const slashLastIndex = htmlUrl.lastIndexOf('/');
    const kbUrl = slashLastIndex === htmlUrl.length - 1 ? htmlUrl.substr(0, htmlUrl.length - 1) : htmlUrl;
    const kbIndex = kbUrl.indexOf(`/${this.routerEndpoints.KNOWLEDGE_BASE}`);
    return kbUrl.substr(kbIndex);
  }

  /**
   * Prepares listbox options
   * @param {any[]} responseData
   * @returns {SearchSuggestListboxOption[]} listbox options
   */
  prepareListboxOptions(responseData: any[]) {
    return responseData.map(item => {
      return this.createListboxOptionFromItem(item);
    });
  }

  /**
   * Initializes and displays suggestion list.
   * Redirects user to a search results route base on a condition.
   * Toggles error message.
   * Returns query params in non auto mode (useTriggers=true)
   * @param {NgForm} searchForm
   */
  onSearch(searchForm: NgForm) {
    const { q } = searchForm.value;
    this.isSearchQueryInvalid = !searchForm.valid || !q || (q && q.length < this.minChars);

    if (this.isSearchQueryInvalid) {
      return;
    }

    if (this.activeSuggestionIndex !== this.notSelectedSuggestionIndex) {
      this.onActiveSuggestionClick();
    } else {
      const queryParams = this.prepareQueryParams({ ...searchForm.value });

      if (this.useTriggers) {
        this.searchTrigger.emit(queryParams);
      } else {
        this.updateParamsOrRedirect(this.searchResultsUrl, queryParams);
      }
    }
  }

  /**
   * Clears query input and sets focus on it.
   * Updates view with query params in auto mode (useTriggers=false).
   * Returns query params in non auto mode (useTriggers=true)
   */
  onClear() {
    this.searchText = '';
    this.activeSetting = this.searchAdvancedSettings.ANY;
    (<HTMLInputElement>this.queryInputRef.nativeElement).focus();

    const queryParams = this.prepareQueryParams({ q: '' });

    if (this.useTriggers) {
      this.clearTrigger.emit(queryParams);
    } else {
      this.updateParamsOrRedirect('.', queryParams);
    }
  }

  /**
   * Prepares query params
   * @param {[key: string]: string} queryParams
   * @returns {[key: string]: string}
   */
  prepareQueryParams(queryParams: { [key: string]: string }): { [key: string]: string } {
    if (this.showAdvancedSettings) {
      queryParams['advanced'] = this.activeSetting !== SearchAdvancedSettings.ANY ? this.activeSetting : null;
    }

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
    const localizedURL: Array<string> = url !== '.' ? (this.localize.translateRoute([url]) as Array<string>) : [url];
    this.router.navigate(localizedURL, {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
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
        if ((event.target as Element).id === 'regions-search-input') {
          this.onSuggestionSearchClick();
        } else {
          this.onActiveSuggestionClick();
        }
        break;
      case 'Tab':
        this.isListBoxExpanded = !this.isListBoxExpanded;
        break;
      case 'Space':
        if (event.shiftKey) {
          this.isListBoxExpanded = true;
          event.preventDefault();
        }
        break;
      case 'Escape':
        this.isListBoxExpanded = false;
    }
  }

  /**
   * Conditionally show suggestion list when input has focus
   */
  onFocusIn() {
    this.toggleDropdown(this.listBoxOptions);
    this.isSearchQueryInvalid = false;
  }

  /**
   * Navigates to a details of the active item on the suggestion list
   */
  onActiveSuggestionClick() {
    if (this.activeSuggestionIndex === this.notSelectedSuggestionIndex) {
      return;
    }

    const listboxOption = this.listBoxOptions[this.activeSuggestionIndex];
    this.router.navigate([listboxOption.url.replace('/', `/${this.translateService.currentLang}/`)]);
  }

  /**
   * Listens on click outside query input. Hides suggestions list.
   * @param {Event} event
   */
  clickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const parentElement = this.queryInputRef.nativeElement as HTMLElement;
    const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

    if (!clickedInside) {
      this.isListBoxExpanded = false;
    }
  }

  /**
   * Destroys unnecessary listeners
   */
  ngOnDestroy() {
    if (this.clickOutsideListener instanceof Function) {
      this.clickOutsideListener();
    }
    if (this.searchTextChanged) {
      this.searchTextChanged.unsubscribe();
    }
    if (this.searchTextCleared) {
      this.searchTextCleared.unsubscribe();
    }
  }

  /**
   * Emit event click to move into search results for screen reader
   */
  emitMoveToSearchResult() {
    this.moveToSearchResultTrigger.emit();
  }

  /**
   * chose and emit of the active item on the suggestion region list
   */
  onSuggestionSearchClick() {
    if (this.activeSuggestionIndex === this.notSelectedSuggestionIndex) {
      return;
    }

    const listboxOption = this.listBoxOptions[this.activeSuggestionIndex];
    this._searchText = listboxOption.hierarchy_label;
    this.regionListboxOption.emit(listboxOption);
    this.listBoxOptions = [];
  }
}

import { DOCUMENT, isPlatformServer, NgIf } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCopy, faLocationArrow, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'ngx-localstorage';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import unique from 'unique-selector';
import { TooltipDirective } from '../../tooltip/tooltip.directive';

@Component({
    selector: 'app-tour-picker',
    templateUrl: 'tour-picker.component.html',
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        TooltipDirective,
        FaIconComponent,
    ],
})
/**
 * Tour picker component
 */
export class TourPickerComponent implements OnDestroy {
  /**
   * Tour picker wrapper reference
   * @type {ElementRef}
   */
  @ViewChild('tourPickerWrapper', { read: ElementRef })
  tourPickerWrapper: ElementRef;

  /**
   * Search input reference
   * @type {ElementRef<HTMLInputElement>}
   */
  @ViewChild('selectorInput', { read: ElementRef })
  selectorInput: ElementRef<HTMLInputElement>;

  /**
   * Css selector
   * @type {string}
   */
  cssSelector: string;

  /**
   * @ignore
   */
  faCopy = faCopy;

  /**
   * @ignore
   */
  faTimes = faTimes;

  /**
   * @ignore
   */
  faLocationArrow = faLocationArrow;

  /**
   * Determines if picker is in finder mode
   * @type {boolean}
   */
  isInFinderMode: boolean = false;
  /**
   * Determines if picker is visible
   * @type {boolean}
   */
  isPickerVisible: boolean;
  /**
   * Subscription cleanup
   * @type {Subject<void>}
   */
  destroy$: Subject<void> = new Subject<void>();
  /**
   * Mouse over listener cleanup
   * @type {() => void}
   */
  private mouseOverListener: () => void = () => {};
  /**
   * Mouse out listener cleanup
   * @type {() => void}
   */
  private mouseOutListener: () => void = () => {};
  /**
   * Mouse click listener cleanup
   * @type {() => void}
   */
  private mouseClickListener: () => void = () => {};
  /**
   * Context menu listener cleanup
   * @type {() => void}
   */
  private contextMenuListener: () => void = () => {};

  /**
   * @ignore
   */
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
    private readonly renderer: Renderer2,
    @Inject(PLATFORM_ID) private readonly platformId: string,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    if (isPlatformServer(platformId)) {
      return;
    }
    this.showPickerOnNavigationEndWhenEnabled();
  }

  /**
   * Toggles finder mode
   */
  toggleFinderMode(): void {
    this.isInFinderMode = !this.isInFinderMode;
    if (this.isInFinderMode) {
      this.enableFinder();
      return;
    }
    this.disableFinder();
  }

  /**
   * Hides picker
   */
  hidePicker(): void {
    this.isPickerVisible = false;
    this.disableFinder();
    window.sessionStorage.removeItem('tourPicker');
    this.router.navigate([], { queryParams: { tourPicker: null }, queryParamsHandling: 'merge' });
    this.renderer.removeStyle(this.document.body.querySelector('app-header header'), 'padding-top');
  }

  /**
   * Copies selected element selector to clipboard
   */
  copyToClipboard(): void {
    this.selectorInput.nativeElement.select();
    this.document.execCommand('copy');
    this.selectorInput.nativeElement.blur();
  }

  /**
   * Cleanups subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Shows picker on navigation end when picker is enabled
   */
  private showPickerOnNavigationEndWhenEnabled(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const tourPicker = this.activatedRoute.snapshot.queryParamMap.get('tourPicker');
        if (tourPicker) {
          window.sessionStorage.setItem('tourPicker', 'true');

          this.router.navigate([], {
            queryParams: {
              tourPicker: null,
            },
            queryParamsHandling: 'merge',
          });
        }
        const appHeader = this.document.body.querySelector('app-header header');
        if (tourPicker || window.sessionStorage.getItem('tourPicker')) {
          this.isPickerVisible = true;
          this.renderer.setStyle(appHeader, 'padding-top', '60px');
          return;
        }
        this.isPickerVisible = false;
        this.renderer.removeStyle(appHeader, 'padding-top');
      });
  }

  /**
   * Enables finer mode
   */
  private enableFinder(): void {
    this.listenToMouseOverEvent();
    this.listenToMouseOutEvent();
    this.listenToMouseClickEvent();
    this.listenToContextMenuClick();
  }

  /**
   * Listens to context menu click
   */
  private listenToContextMenuClick(): void {
    this.contextMenuListener = this.renderer.listen(this.document.body, 'contextmenu', e => {
      return false;
    });
  }

  /**
   * Listens to mouse click event
   */
  private listenToMouseClickEvent(): void {
    this.mouseClickListener = this.renderer.listen(this.document.body, 'mousedown', e => {
      if (e.button !== 2) {
        return;
      }
      e.preventDefault();
      const { target } = e;
      if (this.isHoverInsidePicker(target)) {
        return;
      }
      const options = { excludeRegex: /\.tour-picker-selected|\.ng-.*|:hover|.hovered/ };

      this.cssSelector = unique(target, options);
    });
  }

  /**
   * Listens to mouse out event
   */
  private listenToMouseOutEvent(): void {
    this.mouseOutListener = this.renderer.listen(document.body, 'mouseout', e => {
      const { target } = e;
      if (this.isHoverInsidePicker(target)) {
        return;
      }
      this.renderer.removeClass(target, 'tour-picker-selected');
    });
  }

  /**
   * Listens to mouse out event
   */
  private listenToMouseOverEvent(): void {
    this.mouseOverListener = this.renderer.listen(document.body, 'mouseover', e => {
      const { target } = e;
      if (this.isHoverInsidePicker(target)) {
        return;
      }

      this.renderer.addClass(target, 'tour-picker-selected');
    });
  }

  /**
   * Determines if mouse hovers over picker
   * @param target
   * @returns {boolean}
   */
  private isHoverInsidePicker(target): boolean {
    const parentElement = this.tourPickerWrapper.nativeElement as HTMLElement;
    return parentElement.outerHTML.indexOf(target.outerHTML) !== -1;
  }

  /**
   * Disables finder
   */
  private disableFinder(): void {
    this.mouseOverListener();
    this.mouseOutListener();
    this.mouseClickListener();
    this.contextMenuListener();
  }
}

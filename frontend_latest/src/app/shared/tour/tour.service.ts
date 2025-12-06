import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef, inject,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShepherdService } from 'angular-shepherd';
import { LocalStorageService } from 'ngx-localstorage';
import { pathToRegexp } from 'path-to-regexp';
import { Observable, ReplaySubject, Subject, Subscription, zip } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { TourProgressComponent } from '@app/shared/tour/progress/tour-progress/tour-progress.component';
import { ShepardStep, Tour, TourItem, TourProgress } from '@app/shared/tour/Tour';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourItemTreeNode } from '@app/shared/tour/TourItemTreeNode';

/**
 * Tour service
 */
@Injectable({
  providedIn: 'root'
})
export class TourService implements OnDestroy {
  /**
   * Determine is button should be active
   * @type {Observable<boolean>}
   */
  isButtonActive: Observable<boolean>;

  /**
   * Button visibility flag
   * @type {boolean}
   */
  private isButtonShouldBeVisibleForCurrentRoute$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  /**
   * Tour saved progress
   * @type {ReplaySubject<TourProgress>}
   */
  private tourSavedProgress$: ReplaySubject<TourProgress> = new ReplaySubject<TourProgress>(1);

  /**
   * Subscription cleanup subject
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Tour progress component reference
   * @type {ComponentRef<TourProgressComponent>}
   */
  private tourProgressComponentRef: ComponentRef<TourProgressComponent>;

  /**
   * Navigation start subscription reference
   * @type {Subscription}
   */
  private navigationStart$: Subscription;

  /**
   * Determine if buttons should be active
   * @type {ReplaySubject<boolean>}
   */
  private isButtonActive$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  /**
   * Current rout url
   * @type {string}
   */
  private currentRouteUrl: string;

  /**
   * Change step click listener
   * @type {Subscription}
   */
  private changeStepClickListener$: Subscription;

  /**
   * CSS selector of last clicked element
   * @type {string}
   */
  private lastClickedElementCSSSelector: string;

  /**
   * Renderer2 instance
   * @type {Renderer2}
   */
  private renderer2: Renderer2;

  /**
   * Temporary overlay
   * @type {HTMLDivElement}
   */
  private overlay: HTMLDivElement;
  /**
   * Determine if navigation source is tour clickable element
   * @type {boolean}
   */
  private isNavigationFromClickableElement: boolean;

  /**
   * Navigation clickable element timeout reference
   * @type {number}
   */
  private navigationFromClickableElement$: ReturnType<typeof setTimeout>;

  /**
   * Visible steps without optional
   * @type {Array<TourItem>}
   */
  private visibleStepsWithoutOptional: Array<TourItem>;

  /**
   * Tour items tree
   * @type {TourItemTreeNode}
   */
  private tree: TourItemTreeNode;

  private readonly localStorageService = inject(LocalStorageService);

  /**
   * @ignore
   */
  constructor(
    private readonly tourDataService: TourDataService,
    private readonly shepherdService: ShepherdService,
    private readonly appRef: ApplicationRef,
    private readonly router: Router,
    private readonly rendererFactory: RendererFactory2,
    private readonly featureFlagService: FeatureFlagService,
    // private readonly localStorageService: LocalStorageService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.renderer2 = this.rendererFactory.createRenderer(null, null);

    this.setupButtonVisibilityForCurrentRoute();
    this.isButtonActive = this.isButtonActive$.asObservable();
  }

  /**
   * Removes language prefix from route
   * @param url
   * @returns {string}
   */
  private static removeLanguagePrefixFromRoute(url: string): string {
    let currentRoute = url.replace(/^(\/pl)?(\/en)?/, '');
    currentRoute = currentRoute === '' ? '/' : currentRoute;
    return currentRoute;
  }

  /**
   * Starts tour
   * @param tour
   */
  startTour(tour: Tour): void {
    this.createProgressBar();
    this.isButtonActive$.next(false);
    this.shepherdService.defaultStepOptions = {};
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.tree = TourItemTreeNode.fromArray(tour.items, document);
    this.visibleStepsWithoutOptional = this.tree.findVisibleItems();
    const steps: Array<ShepardStep> = this.visibleStepsWithoutOptional.map((tourItem, index) => ({
      title: tourItem.name,
      text: tourItem.content,
      attachTo: {
        element: tourItem.css_selector,
        on: tourItem.position,
      },
      popperOptions: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 16],
            },
          },
        ],
      },
      scrollTo: { behavior: 'smooth', block: 'center' },
      when: {
        show: () => {
          const shepherd = this.shepherdService.tourObject;
          const currentStepElement = shepherd.getCurrentStep().getElement();
          const content = currentStepElement.querySelector('.shepherd-content');
          this.changeStepClickListener$ = this.tourProgressComponentRef.instance.changeStep
            .pipe(take(1))
            .subscribe(id => shepherd.show(id));
          const domElem = (this.tourProgressComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
          this.tourProgressComponentRef.instance.steps = shepherd.steps.map(step => {
            return shepherd.getCurrentStep().id === step.id;
          });
          content.appendChild(domElem);
          this.tourProgressComponentRef.instance.refresh();
        },
      },
      id: index + '',
      beforeShowPromise: this.clickOnClickableStepBeforeShowNextStep(
        this.visibleStepsWithoutOptional,
        this.shepherdService.tourObject,
        index,
      ),
      buttons: this.getStepButtons(index, this.visibleStepsWithoutOptional.length),
      classes: 'tour-wrapper',
    }));

    this.shepherdService.addSteps(steps);
    this.shepherdService.tourObject.on('cancel', () => {
      const currentStepId = Number(this.shepherdService.tourObject.getCurrentStep().id);
      this.pauseTour(
        Object.assign(tour, {
          progress: {
            tourId: tour.id,
            currentStepIndex: currentStepId,
            currentStepRoute: TourService.removeLanguagePrefixFromRoute(this.router.url.split('?')[0])}
        }),
      );
      this.removeProgressBar();
      this.navigationStart$.unsubscribe();
      this.isButtonActive$.next(true);
      this.lastClickedElementCSSSelector = null;
      this.visibleStepsWithoutOptional = [];
    });
    this.shepherdService.tourObject.on('complete', () => {
      this.localStorageService.remove('tour');
      this.tourSavedProgress$.next({
        tourId: tour.id,
        currentStepIndex: 0,
        currentStepRoute: tour.items[0].route});
      this.removeProgressBar();
      this.navigationStart$.unsubscribe();
      this.localStorageService.set('tourComplete', true);
      this.isButtonActive$.next(true);
      this.lastClickedElementCSSSelector = null;
      this.visibleStepsWithoutOptional = [];
    });
    this.subscribeForRouteChanges();
    if (tour.progress && tour.progress.currentStepIndex) {
      this.shepherdService.tourObject.show(tour.progress.currentStepIndex);
      return;
    }
    this.shepherdService.start();
  }

  /**
   * Gets button visibility for current route
   * @returns {Observable<boolean>}
   */
  getButtonVisibilityForCurrentRoute(): Observable<boolean> {
    return this.isButtonShouldBeVisibleForCurrentRoute$.asObservable();
  }

  /**
   * Gets current tour
   * @returns {Observable<Tour & {progress: TourProgress}>}
   */
  getCurrentTour(): Observable<Tour> {
    return this.tourSavedProgress$.pipe(
      switchMap(tourProgress => {
        return this.tourDataService
          .getTourById(tourProgress.tourId)
          .pipe(map(tour => Object.assign(tour, { progress: tourProgress })));
      }),
    );
  }

  /**
   * Pauses tour
   * @param tour
   */
  pauseTour(tour: Tour): void {
    const pausedTour = tour.progress;
    this.localStorageService.set('tour', pausedTour);
    this.tourSavedProgress$.next(pausedTour);
  }

  /**
   * Cleanups
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    clearTimeout(this.navigationFromClickableElement$);
  }

  /**
   * Clicks on clickable step before showing next stop
   * @param tourItems
   * @param shepard
   * @param index
   * @returns {() => (Promise<void>)}
   */
  private clickOnClickableStepBeforeShowNextStep(tourItems: Array<TourItem>, shepard: any, index: number): () => Promise<void> {
    return () => {
      // tslint:disable-next-line:no-unused-expression
      this.changeStepClickListener$ && this.changeStepClickListener$.unsubscribe();
      return new Promise<void>(async resolve => {
        await this.clickClickableParentBeforeStepChangeWhenNecessary(tourItems, shepard, index, resolve);
      });
    };
  }

  /**
   * Click on clickable parent step when necessary
   * @param tourItems
   * @param shepherd
   * @param id
   * @param cb
   */
  private async clickClickableParentBeforeStepChangeWhenNecessary(
    tourItems: Array<TourItem>,
    shepherd: any,
    id: number,
    cb: () => void,
  ): Promise<void> {
    const itemsToClick = this.tree.findTourItemsToClick(tourItems[id].css_selector);
    const isFirstChild = itemsToClick.length === 0;
    if (isFirstChild) {
      cb();
    }

    for (const itemToClick of itemsToClick) {
      await new Promise(resolve => {
        if (itemToClick.is_clickable) {
          this.clickOnClickableStep(itemToClick, resolve as () => void);
        } else {
          this.clickOnExpendableElement(itemToClick, resolve);
        }
      });
    }
    cb();
  }

  /**
   * Clicks on clickable element
   * @param item
   * @param cb
   */
  private clickOnClickableStep(item: TourItem, cb: () => void): void {
    this.isNavigationFromClickableElement = true;
    this.document.querySelector<HTMLButtonElement>(item.css_selector).click();
    this.navigationFromClickableElement$ = setTimeout(() => {
      this.isNavigationFromClickableElement = false;
    });
    this.createOverlay();
    this.lastClickedElementCSSSelector = item.css_selector;
    this.appRef.isStable
      .pipe(
        filter(res => res),
        take(1),
      )
      .subscribe(() => {
        if (!!this.overlay) {
          this.renderer2.removeChild(this.document.body, this.overlay);
          this.overlay = null;
        }
        cb();
      });
  }

  /**
   * Clicks on expendable element
   * @param tourItem
   * @param index
   * @param cb
   */
  private clickOnExpendableElement(tourItem: TourItem, cb: (value?: any) => void = () => {}): void {
    const isAlreadyExpandedFromOutsideTour = document.querySelector(tourItem.css_selector)?.getAttribute('aria-pressed') === 'true';
    if (
      isAlreadyExpandedFromOutsideTour ||
      this.visibleStepsWithoutOptional.find(item => item.css_selector === tourItem.css_selector).expanded === true
    ) {
      return cb();
    }
    this.document.querySelector<HTMLButtonElement>(tourItem.css_selector)?.click();
    this.appRef.isStable
      .pipe(
        filter(res => res),
        take(1),
      )
      .subscribe(() => {
        this.visibleStepsWithoutOptional = this.visibleStepsWithoutOptional.map(item => {
          if (item.css_selector === tourItem.css_selector) {
            return Object.assign({}, tourItem, { expanded: true });
          }
          return item;
        });
        cb();
      });
  }

  /**
   * Creates temporary overlay
   */
  private createOverlay(): void {
    if (!!this.overlay) {
      return;
    }
    this.overlay = this.document.createElement('div');
    this.renderer2.addClass(this.overlay, 'tour-overlay');
    this.renderer2.appendChild(this.document.body, this.overlay);
  }

  /**
   * Subscribes for route changes
   */
  private subscribeForRouteChanges(): void {
    this.navigationStart$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        filter(() => !this.isNavigationFromClickableElement),
        filter((event: NavigationStart) => event.url.split('?')[0] !== this.currentRouteUrl),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.shepherdService.hide();
        this.isButtonActive$.next(true);
      });
  }

  /**
   * Gets step buttons
   * @param stepIndex
   * @param stepsCount
   * @returns {any[]}
   */
  private getStepButtons(stepIndex: number, stepsCount: number): Array<any> {
    const buttons = [];
    const pauseButton = {
      classes: 'btn btn-outline-primary btn-sm prev-btn',
      text: this.translate.instant('Guide.ButtonCancel'),
      type: 'cancel',
    };
    const nextButton = {
      classes: 'btn btn-primary btn-sm',
      text: this.translate.instant('Guide.ButtonNext'),
      type: 'next',
    };
    const closeButton = {
      classes: 'btn btn-primary btn-sm',
      text: this.translate.instant('Guide.ButtonClose'),
      action: function () {
        this.complete();
      },
    };
    const backButton = {
      classes: 'btn btn-primary btn-sm',
      text: this.translate.instant('Guide.ButtonBack'),
      type: 'back',
    };
    const isLastStep = stepIndex === stepsCount - 1;
    buttons.push(pauseButton);
    if (stepIndex > 0) {
      buttons.push(backButton);
    }
    if (!isLastStep) {
      buttons.push(nextButton);
    } else {
      buttons.push(closeButton);
    }
    return buttons;
  }

  /**
   * Checks if required elements are present on screen
   * @returns {Observable<boolean>}
   */
  private isRequiredElementsOnScreen(event: NavigationEnd): Observable<boolean> {
    const currentRoute = TourService.removeLanguagePrefixFromRoute(event.url.split('?')[0]);
    const tourExists = this.tourDataService.getTourForRoute(currentRoute);
    return this.tourSavedProgress$.pipe(
      switchMap(currentTour => {
        return zip(this.tourDataService.getTourById(currentTour.tourId), tourExists);
      }),
      map(([tour, isTour]) => {
        const requiredElements = [];
        tour.items.forEach(step => {
          if (!step.is_optional) {
            requiredElements.push({ selector: step.css_selector });
          }
        });
        return [requiredElements, isTour];
      }),
      map(([requiredElements, isTour]) => {
        if (!isTour) {
          return false;
        }
        this.shepherdService.requiredElements = requiredElements as any[];

        // if (!this.shepherdService.requiredElementsPresent()) {
        //   throw new Error('Tour required elements not found - ' + JSON.stringify(requiredElements));
        // }
        return true;
      }),
    );
  }

  /**
   * Setups button visibility for current route
   */
  private setupButtonVisibilityForCurrentRoute(): void {
    let isAppStable$: Subscription;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.isButtonShouldBeVisibleForCurrentRoute$.next(false);
          if (isAppStable$) {
            isAppStable$.unsubscribe();
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRouteUrl = event.url.split('?')[0];
        isAppStable$ = this.appRef.isStable
          .pipe(
            filter(res => res),
            take(1),
            switchMap(() => {
              return zip(this.isButtonShouldBeVisibleForCurrentRoute(event), this.isRequiredElementsOnScreen(event)).pipe(
                takeUntil(this.destroy$),
              );
            }),
          )
          .subscribe(([isButtonShouldBeVisibleForCurrentRoute, isRequiredElementsOnScreen]: [boolean, boolean]) => {
            this.isButtonShouldBeVisibleForCurrentRoute$.next(isButtonShouldBeVisibleForCurrentRoute && isRequiredElementsOnScreen);
          });
      });
  }

  private isButtonShouldBeVisibleForCurrentRoute(event: NavigationEnd): Observable<boolean> {
    return this.validateButtonVisibilityForCurrentRoute(event);
  }

  /**
   * Validates button visibility for current route
   * @param event
   * @returns {Observable<boolean>}
   */
  private validateButtonVisibilityForCurrentRoute(event: NavigationEnd): Observable<boolean> {
    const currentRoute = TourService.removeLanguagePrefixFromRoute(event.url.split('?')[0]);
    return this.tourDataService.getTourForRoute(currentRoute).pipe(
      map(tour => {
        if (!tour) {
          return false;
        }
        const modifiedRoute = tour.items[0].route.replace('?', '');
        const isTourStartsOnCurrentRoute = pathToRegexp(modifiedRoute).regexp.test(currentRoute);
        const pausedTour = this.getPausedTour();
        if (isTourStartsOnCurrentRoute &&
          (!pausedTour || (pausedTour && !pathToRegexp(pausedTour.currentStepRoute).regexp.test(currentRoute)))) {
          this.tourSavedProgress$.next({
            tourId: tour.id,
            currentStepIndex: 0,
            currentStepRoute: tour.items[0].route});
          return true;
        }

        if (!!pausedTour) {
          this.tourSavedProgress$.next(pausedTour);
        }

        return pausedTour && pausedTour.tourId === tour.id && pausedTour.currentStepRoute === currentRoute;
      }),
    );
  }

  /**
   * Gets paused tour
   * @returns {any}
   */
  private getPausedTour(): TourProgress | null | undefined {
    return this.localStorageService.get<TourProgress>('tour');
  }

  /**
   * Creates progress bar
   */
  private createProgressBar(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TourProgressComponent);
    const componentRef: ComponentRef<TourProgressComponent> = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    this.tourProgressComponentRef = componentRef;
  }

  /**
   * Removes progress bar
   */
  private removeProgressBar(): void {
    this.tourProgressComponentRef = null;
  }
}

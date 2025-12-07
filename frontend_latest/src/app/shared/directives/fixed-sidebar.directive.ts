import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

@Directive({
    selector: '[appFixedSidebar]',
    standalone: true,
})
export class FixedSidebarDirective implements AfterViewInit, OnDestroy {

    /**
     * Min window width to position sidebar
     */
    @Input('fixedSidebarMinWindowWidth') minWindowWidth = 1200;

    /**
     * Time to get better performance, throttle the event stream and keep fixed element scrolling smooth
     */
    @Input('fixedSidebarThrottleTime') throttleTime = 20;

    /**
     * Padding from the top of the window during scroll
     */
    @Input('fixedSidebarPaddingTop') paddingTop = 15;

    /**
     * Window events subscription
     */
    windowEventsSubscription: Subscription;

    /**
     * @ignore
     */
    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                @Inject(DOCUMENT) private document: Document,
                @Inject(PLATFORM_ID) private platformId: string) {
    }

    /**
     * Sets sidebar position as fixed
     */
    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.positionSidebar();
    }

    /**
     * Positions sidebar on desktop
     */
    private positionSidebar() {
        const sidebar = this.elementRef.nativeElement as HTMLElement;
        const parent = sidebar.parentElement;

        const resize$ = fromEvent(this.document.defaultView, 'resize');
        const scroll$ = fromEvent(this.document.defaultView, 'scroll');

        this.windowEventsSubscription = merge(resize$, scroll$)
            .pipe(
                throttleTime(this.throttleTime),
                map(() => ({windowWidth: window.innerWidth, pageY: window.pageYOffset}))
            )
            .subscribe(({windowWidth, pageY}) => {
                if (windowWidth < this.minWindowWidth || parent.offsetHeight === sidebar.offsetHeight) {
                    this.renderer.removeAttribute(sidebar, 'style');
                    return;
                }

                if (pageY + this.paddingTop >= parent.offsetTop) {
                    this.renderer.setStyle(sidebar, 'transition', 'none');
                    this.renderer.setStyle(sidebar, 'position', 'fixed');
                    this.renderer.setStyle(sidebar, 'top', this.paddingTop + 'px');

                    if (pageY - parent.offsetHeight > parent.offsetTop - sidebar.offsetHeight) {
                        this.renderer.setStyle(sidebar, 'position', 'absolute');
                        this.renderer.setStyle(sidebar, 'top', (parent.offsetHeight + parent.offsetTop - sidebar.offsetHeight + this.paddingTop) + 'px');
                    }
                } else {
                    this.renderer.removeAttribute(sidebar, 'style');
                }
            });
    }

    /**
     * Unsubscribes from window events subscription
     */
    ngOnDestroy() {
        if (this.windowEventsSubscription) {
          this.windowEventsSubscription.unsubscribe();
        }
    }
}

import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';

/**
 * Focus Trap Directive. Supports accessibility.
 * Limits keyboard navigation through focusable elements to a range set by first and last focusable elements within a given container.
 */
@Directive({
    selector: '[app-focus-trap]',
    standalone: true
})
export class FocusTrapDirective implements OnInit, OnDestroy {

    /**
     * First focusable element of focus trap directive
     */
    firstElement: HTMLElement | HTMLInputElement;

    /**
     * Last focusable element of focus trap directive
     */
    lastElement: HTMLElement | HTMLInputElement;

    /**
     * Listens on clicks on firstElement
     */
    firstElementListener: () => void;

    /**
     * Listens on clicks on lastElement
     */
    lastElementListener: () => void;

    /**
     * @ignore
     */
    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: string
    ) {}

    /**
     * Initializes first and last focusable elements
     */
    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) { return; }

        this.firstElement = this.elementRef.nativeElement.querySelector('.focus-trap-first');
        this.lastElement = this.elementRef.nativeElement.querySelector('.focus-trap-last');

        if (!this.firstElement || !this.firstElement) { return; }

        this.firstElementListener = this.renderer.listen(this.firstElement, 'keydown', (event) => {
            if (event.key !== 'Tab') { return; }

            if (event.shiftKey && this.lastElement) {
                event.preventDefault();
                this.lastElement.focus();
            }
        });

        this.lastElementListener = this.renderer.listen(this.lastElement, 'keydown', (event) => {
            if (event.key !== 'Tab') { return; }

            if (!event.shiftKey && this.firstElement) {
                event.preventDefault();
                this.firstElement.focus();
            }
        });
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.firstElementListener = undefined;
        this.lastElementListener = undefined;
    }
}

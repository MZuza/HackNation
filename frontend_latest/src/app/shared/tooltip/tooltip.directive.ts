import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Injector, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';

import { TooltipWithTitleComponent } from '@app/shared/large-tooltip/tooltip-with-title.component';
import { TOOLTIP_DATA } from '@app/shared/tooltip/TooltipData';
import { TooltipPlacement } from '@app/shared/tooltip/tooltipPlacement';

/**
 * Tooltip Directive
 */
@Directive({
    selector: '[appTooltip]',
    standalone: true,
})
export class TooltipDirective implements OnInit {
  /**
   * Tooltip position variants
   * @type {{[p: string]: ConnectedPosition}}
   */
  private static positions: { [key: string]: ConnectedPosition } = {
    bottom: {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: -1,
    },
    top: {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: 2,
    },
    left: {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: 2,
    },
    right: {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: -6,
    },
  };

  /**
   * Tooltip text
   * @type {string}
   */
  @Input('appTooltip')
  text: string;

  /**
   * Tooltip title
   * @type {string}
   */
  @Input()
  title: string;

  /**
   * star rating for dataset openness
   * @type {number}
   */
  @Input('levelDataOpennessTooltip')
  levelDataOpenness: number;

  /**
   * Tooltip placement
   * When array provided, tooltip will find the best position starting from the beginning of the array.
   * If first array item fits to screen it will be picked, if not tooltip chose next
   * @type {"bottom" | "top" | "left" | "right"}
   */
  @Input()
  placement: TooltipPlacement | Array<TooltipPlacement> = 'bottom';

  /**
   * Tooltip container class
   * @type {string}
   */
  @Input()
  container: string;

  /**
   * Overlay reference
   * @type {OverlayRef}
   */
  private overlayRef: OverlayRef;
  private isIn = false;

  constructor(
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly elementRef: ElementRef,
    private readonly injector: Injector,
    private readonly renderer: Renderer2,
  ) {}

  /**
   * Shows tooltip on host mouse enter event
   */
  @HostListener('mouseenter')
  @HostListener('focus')
  onMouseEnter() {
    this.show();
  }

  /**
   * Hides tooltip on host mouse leave event
   */
  @HostListener('mouseleave')
  @HostListener('blur')
  onMouseLeave() {
    if (!this.isIn) {
      this.hide();
    }
  }
  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.hide();
  }

  /**
   * Initializes tooltip
   */
  ngOnInit() {
    const connectedElement = this.container ? document.querySelector(this.container) : this.elementRef;
    const flexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(connectedElement)
      .withPositions(this.getConnectedPosition());
    this.overlayRef = this.overlay.create({
      positionStrategy: flexibleConnectedPositionStrategy,
      panelClass: 'app-tooltip',
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  /**
   * Shows tooltip
   */
  show(): void {
    if (!this.text || this.overlayRef.hasAttached()) {
      return;
    }
    const userProfilePortal = new ComponentPortal(
      TooltipWithTitleComponent,
      null,
      this.createInjector({
        title: this.title,
        text: this.text,
        levelDataOpenness: this.levelDataOpenness,
      }),
    );

    this.overlayRef.attach(userProfilePortal);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', 'app-tooltip');
    this.overlayRef.hostElement.addEventListener('mouseenter', e => {
      this.isIn = true;
    });
    this.overlayRef.hostElement.addEventListener('mouseleave', e => {
      this.isIn = false;
      this.hide();
    });
  }

  /**
   * Hides tooltip
   */
  hide(): void {
    if (!this.text || !this.overlayRef.hasAttached()) {
      return;
    }
    this.overlayRef.detach();
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
  }

  /**
   * Creates portal injector with data that will be provided to tooltip
   * @param dataToPass
   * @returns {PortalInjector}
   */
  createInjector(dataToPass): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(TOOLTIP_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
  }

  /**
   * Gets connected position
   * @private
   */
  private getConnectedPosition(): ConnectedPosition[] {
    if (Array.isArray(this.placement)) {
      return this.placement.map(placement => {
        return TooltipDirective.positions[placement];
      });
    }
    if (typeof this.placement === 'string') {
      return [TooltipDirective.positions[this.placement]];
    }
    return [];
  }
}

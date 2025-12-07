import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { InfoTooltipComponent } from '@app/shared/info-tooltip/info-tooltip.component';

/**
 * Info Tooltip Directive
 */
@Directive({
    selector: '[appInfoTooltip]',
    standalone: true,
})
export class InfoTooltipDirective implements OnInit, OnDestroy {
  /**
   * Tooltip Text
   * @type {string}
   */
  @Input('appInfoTooltip')
  tooltipText: string;

  /**
   * Tooltip title visibility flag
   * @type {boolean}
   */
  @Input()
  withTooltipTitle: boolean;

  /**
   * Determines if margin should be added
   * @type {boolean}
   */
  @Input()
  withoutMargin: boolean;

  /**
   * Tooltip icon color
   * @type {string}
   */
  @Input('appInfoTooltipIconColor')
  iconColor: string;

  /**
   * Title
   * @type {string}
   */
  @Input('tooltipTitle')
  title: string;
  /**
   * Tooltip component
   * @type {ComponentRef<InfoTooltipComponent>}
   */
  private component: ComponentRef<InfoTooltipComponent>;
  /**
   * Clean subscriptions
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * @ignore
   * @param elementRef
   * @param viewContainerRef
   * @param renderer
   * @param resolver
   * @param featureFlagService
   * @param changeDetectorRef
   */
  constructor(
    private readonly elementRef: ElementRef,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly renderer: Renderer2,
    private readonly resolver: ComponentFactoryResolver,
    private readonly featureFlagService: FeatureFlagService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  /**
   * Initializes tooltip when flag enabled
   */
  ngOnInit() {
    if (!this.tooltipText) {
      return;
    }

    this.initializeTooltip();
  }

  /**
   * Cleanups subscriptions
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

  /**
   * Initializes tooltip
   */
  private initializeTooltip() {
    const factory: ComponentFactory<InfoTooltipComponent> = this.resolver.resolveComponentFactory(InfoTooltipComponent);
    this.component = this.viewContainerRef.createComponent(factory);

    this.component.instance.text = this.tooltipText;
    this.component.instance.iconColor = this.iconColor;
    this.withTooltipTitle = this.withTooltipTitle !== undefined;

    this.elementRef.nativeElement.appendChild(this.component.location.nativeElement);
    if (this.withoutMargin === undefined)  {
      this.renderer.addClass(this.viewContainerRef.element.nativeElement, 'mb-1');
    }
    this.component.instance.title = this.title;
    this.changeDetectorRef.markForCheck();
  }
}

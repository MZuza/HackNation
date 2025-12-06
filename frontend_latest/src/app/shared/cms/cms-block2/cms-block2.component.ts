import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CallToActionComponent } from '../widget/call-to-action/call-to-action.component';
import { HeadingComponent } from '../widget/heading/heading.component';
import { ImageComponent } from '../widget/image/image.component';
import { RawTextComponent } from '../widget/raw-text/raw-text.component';
import { VideoComponent } from '../widget/video/video.component';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Cms blocks component
 */
@Component({
    selector: 'cms-block2',
    templateUrl: './cms-block2.component.html',
    animations: [toggleVertically],
    standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgIf,
    ImageComponent,
    RouterLink,
    RawTextComponent,
    VideoComponent,
    CallToActionComponent,
    HeadingComponent,
    SanitizeHtmlPipe,
  ],
})
export class CmsBlock2Component implements OnInit, OnDestroy {
  /**
   * Widget subject
   */
  @Input() widgetsSubject: BehaviorSubject<IWidget[]>;

  /**
   * Determines whether to show the carousel
   */
  @Input() showCarousel = false;

  /**
   * Widget to display
   */
  @Input() oneWidget: IWidget;

  /**
   * Is full width
   */
  @Input() isFullWidth = true;

  /**
   * Additional container class
   * @type {string}
   */
  @Input() className: string;

  @Input() isFooterLogos = false;

  /**
   * Widget type enum
   */
  readonly widgetType = WidgetType;

  /**
   * Array of widgets
   */
  widgets: IWidget[] = [];

  /**
   * Flag for loaded content, does not display carousel if content is not ready
   */
  contentHasLoaded = false;

  widgetsSubjectSubscription: Subscription;

  /**
   * Subscribe to widgetSubject
   */
  ngOnInit() {
    if (this.widgetsSubject) {
      this.widgetsSubjectSubscription = this.widgetsSubject.subscribe(response => {
        this.widgets = response;
      });
    } else {
      this.widgets.push(this.oneWidget);
    }
  }

  ngOnDestroy() {
    this.widgetsSubjectSubscription?.unsubscribe();
  }
}

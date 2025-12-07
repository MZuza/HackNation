import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';
import { BehaviorSubject } from 'rxjs';
import { CallToActionComponent } from '../widget/call-to-action/call-to-action.component';
import { HeadingComponent } from '../widget/heading/heading.component';
import { ImageComponent } from '../widget/image/image.component';
import { RawTextComponent } from '../widget/raw-text/raw-text.component';
import { VideoComponent } from '../widget/video/video.component';

import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';

/**
* Cms blocks component
*/
@Component({
    selector: 'cms-block',
    templateUrl: './cms-block.component.html',
    standalone: true,
    imports: [
      NgIf,
      CarouselComponent,
      NgFor,
      SlideComponent,
      NgTemplateOutlet,
      ImageComponent,
      RawTextComponent,
      VideoComponent,
      CallToActionComponent,
      HeadingComponent
    ]
})

export class CmsBlockComponent implements OnInit {

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
    * Widget type enum
    */
    readonly  widgetType = WidgetType;

    /**
    * Array of widgets
    */
    widgets: IWidget[] = [];

    /**
    * Flag for loaded content, does not display carousel if content is not ready
    */
    contentHasLoaded = false;

    /**
    * Carousel component
    */
    @ViewChild(CarouselComponent) carouselComponent: CarouselComponent;

    /**
    * Host listener for enter events
    */
    @HostListener('keyup.enter', ['$event']) onKeyUp(event: KeyboardEvent) {
        if ((event as any).srcElement.classList.contains('carousel')) {
            this.onSlideClick(event);
        }
    }

    /**
    * Subscribe to widgetSubject
    */
    ngOnInit() {
        if (this.widgetsSubject) {
            this.widgetsSubject.subscribe(response => {
                if (response) {
                    this.widgets = response;
                }
            });
        } else {
            this.widgets.push(this.oneWidget);
        }
    }

    /**
    * Carousel event handler on enter keystroke
    * @param {event} event
    */
    private onSlideClick(event) {
        const lastSlideIndex = this.carouselComponent.slides.length - 1;
        const nextSlideIndex =   this.carouselComponent.getCurrentSlideIndex();
        const activeSlideIndex = nextSlideIndex - 1 < 0 ? lastSlideIndex : nextSlideIndex - 1;

        const slidesNodesArray = event.target.querySelectorAll('slide');
        const actualSlideNode = slidesNodesArray[activeSlideIndex];
        const imageLink = actualSlideNode.querySelector('a').href;
        this.carouselComponent.previousSlide(true);
        window.location.href = (imageLink);
    }
}

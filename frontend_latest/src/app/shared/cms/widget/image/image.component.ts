import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

import { CmsService } from '@app/services/cms.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { IWidgetStyleForHtmlInject } from '@app/services/models/cms/controls/widget-style';
import { IBanner } from '@app/services/models/cms/widgets/banner';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';

/**
 * Image components displays images from CMS
 * @example
 * <cms-image></cms-image>
 */
@Component({
    selector: 'cms-image',
    templateUrl: './image.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        NgStyle,
        TranslatePipe,
    ],
})
export class ImageComponent extends WidgetAbstractComponent implements OnInit {
  @Input() banner: IBanner | any;
  @Input() isFooterLogos: boolean;
  @Output() imageHasLoaded = new EventEmitter();

  /**
   * Class name for image
   */
  cssClass = '';

  /**
   * Styles for image
   */
  styles: IWidgetStyleForHtmlInject;

  /**
   * Url for image
   */
  urlImage: any;

  /**
   * Widget type enum
   */
  readonly widgetType = WidgetType;

  constructor(private featureFlagService: FeatureFlagService, protected cmsService: CmsService, protected sanitizer: DomSanitizer) {
    super(cmsService, sanitizer);
  }

  /**
   * Check origin of image: widget or hyper editor
   */
  ngOnInit() {
    if (this.banner.settings && this.banner.settings.image) {
      this.displayImageFromHyperEditor();
      return;
    }

    if (this.banner.value) {
      this.displayImageFromWidget();
    }
  }

  /**
   * Display image from hyper editor cms section
   */
  private displayImageFromHyperEditor() {
    const { url, image } = this.banner.settings;
    const imgTitleArray = image.title.split('.');
    let imgPart = image.title;

    if (imgTitleArray instanceof Array) {
      imgPart = imgTitleArray.pop();
    }

    this.banner.value = {
      action_url: url ? url : '',
      target: '_blank',
      title: image.url && image.url.indexOf(imgPart) !== -1 ? '' : image.title,
      alt: image.alt,
    };

    this.urlImage = image.url;
    this.styles = this.cmsService.addStyle(this.banner, 'hyperEditor');

    if (this.banner.general && this.banner.general.textAlignment) {
      this.cssClass = `cmsImage--${this.banner.general.textAlignment}`;
    } else {
      this.cssClass = `cmsImage--neutral`;
    }
  }

  /**
   * Display image from widget cms section
   */
  private displayImageFromWidget() {
    if (this.featureFlagService) {
      if (this.banner.value.format) {
        this.cssClass = `cmsImage--${this.banner.value.format}`;
      } else {
        this.cssClass = this.isFooterLogos ? 'cmsImage--logo' : 'cmsImage--center';
      }
    } else {
      this.cssClass = this.banner.value.format ? `cmsImage--${this.banner.value.format}` : 'cmsImage--center';
    }

    if (this.banner.type === WidgetType.IMAGE || this.banner.type === WidgetType.SVG) {
      this.urlImage = this.banner.value.download_url;
    } else if (this.banner.type === WidgetType.BANNER && this.banner.value.image) {
      this.urlImage = this.banner.value.image.download_url;
    }

    this.imageHasLoaded.emit(true);
  }
}

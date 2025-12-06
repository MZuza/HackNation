import { Injectable } from '@angular/core';

import { IColor } from '@app/services/models/cms/controls/color';
import { ISpace } from '@app/services/models/cms/controls/space';
import { IWidgetStyleForHtmlInject } from '@app/services/models/cms/controls/widget-style';
import { IWidget } from '@app/services/models/cms/widgets/widget';

/**
 * Landing page style service
 */
@Injectable({
  providedIn: 'root',
})
export class LandingPageStyleService {
  /**
   * Adds a css style to the widget.
   * @param {IWidget} widget to which a style is added
   * @param {string} [origin=any] origin of widget
   */
  public addStyle(widget: IWidget, origin: 'any' | 'hyperEditor' = 'any') {
    if (!widget.general) {
      return;
    }

    const style: IWidgetStyleForHtmlInject = {
      'text-align': widget.general.textAlignment,
      padding: this.createSpace(widget.general.padding),
      margin: this.createSpace(widget.general.margin),
      color: this.createRGBColor(widget.general.foregroundColor),
      'background-color': this.createRGBColor(widget.general.backgroundColor),
    };

    if (this.isImageFromHyperEditor(origin, widget)) {
      delete style.margin;
    }
    return style;
  }

  /**
   * Create string with combined padding/ margin values
   * @param {ISpace} space
   * @return string
   */
  private createSpace(space: ISpace): string {
    if (!space) {
      return '0';
    }

    const unit = space.unit;
    return [
      this.createSpaceElement(unit, space.top),
      this.createSpaceElement(unit, space.right),
      this.createSpaceElement(unit, space.bottom),
      this.createSpaceElement(unit, space.left),
    ].join(' ');
  }

  /**
   * Create margin/padding string
   * @param {string} value
   * @param {number} unit
   * @return string
   */
  private createSpaceElement(unit: string, value: number): string {
    if (value == null) {
      value = 0;
    }
    return value + unit;
  }

  /**
   * Create rgb color string
   * @param {IColor} rgbColor
   * @return string
   */
  private createRGBColor(rgbColor: IColor): string {
    if (!rgbColor) {
      return '';
    }
    return ['rgb(', rgbColor.r, rgbColor.g, rgbColor.b, ')'].join(' ');
  }

  /**
   * Check if widget's image comes from hyper editor
   * @param {string} origin
   * @param {IWidget} widget
   * @return boolean
   */
  private isImageFromHyperEditor(origin: string, widget: IWidget): boolean {
    return origin === 'hyperEditor' && widget.type !== 'video' && !widget.general.textAlignment;
  }
}

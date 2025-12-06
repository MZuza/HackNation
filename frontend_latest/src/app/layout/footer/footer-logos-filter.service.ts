import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { IWidgetSvg } from '@app/services/models/cms/widgets/widget-svg';

@Injectable()
export class FooterLogosFilterService {

  static readonly TAGS_TO_STRIP: string[] = Object.values(HighContrastModeEnum).map(e => `[${e.toLowerCase()}]`);

  constructor(private highContrastService: HighContrastService) {
  }

  static removeTags(elements: IWidgetSvg[]): IWidgetSvg[] {

    return elements.map(element => {

      let newTitle: string = element.value.title;

      FooterLogosFilterService.TAGS_TO_STRIP.forEach(tagToStrip => {
        newTitle = newTitle.replace(tagToStrip, '').trim();
      });
      // Remap element to avoid changing source data
      return {
        ...element,
        value: {
          ...element.value,
          title: newTitle
        }
      };
    });
  }

  public filter(elements: IWidgetSvg[]): Observable<IWidgetSvg[]> {

    return this.highContrastService.getCurrentContrastMode().pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(contrastMode => {

        const filteredElements = elements.filter(element => {
          return element.value.title.includes(`[${contrastMode.toLowerCase()}]`);
        });

        if (filteredElements.length > 0) {
          return FooterLogosFilterService.removeTags(filteredElements);
        }

        const defaultElements: IWidgetSvg[] = elements.filter(element => {
          let hasHighContrastTag: boolean = false;
          FooterLogosFilterService.TAGS_TO_STRIP.forEach(tagToStrip => {
            if (element.value.title.toLowerCase().includes(tagToStrip.toLowerCase())) {
              hasHighContrastTag = true;
            }
          });
          return !hasHighContrastTag;
        });

        return FooterLogosFilterService.removeTags(defaultElements);
      }),
    );
  }
}

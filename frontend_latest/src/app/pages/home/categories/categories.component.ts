import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * Categories Component
 */
@Component({
    selector: 'home-categories',
    templateUrl: './categories.component.html',
    standalone: true,
  imports: [
    InfoTooltipDirective,
    NgIf,
    NgFor,
    RouterLink,
    TranslatePipe,
    LocalizeRouterPipe,
    NgOptimizedImage,
  ],
})
export class CategoriesComponent implements OnInit {
  /**
   * Items (categories) of categories component
   */
  @Input() items;

  /**
   * Query param name
   * @type {string}
   */
  queryParamName: string;

  /**
   * Gets query param name
   */
  ngOnInit() {
    this.queryParamName = 'categories[id][terms]';
  }

  /**
   * Gets query params
   * @param id
   */
  getQueryParam(id: string): { [key: string]: any } {
    return { [this.queryParamName]: id };
  }
}

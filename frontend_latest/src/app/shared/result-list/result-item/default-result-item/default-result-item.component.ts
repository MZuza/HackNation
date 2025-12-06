import { LowerCasePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipDirective } from '../../../tooltip/tooltip.directive';
import { KeywordsComponent } from '../../related-components/keywords/keywords.component';
import { NotesComponent } from '../../related-components/notes/notes.component';

import { ApiModel } from '@app/services/api/api-model';
import { MapParamsToTranslationKeysService } from '@app/services/map-params-to-translation-keys.service';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { StripHtmlWithExceptionPipe } from '@app/shared/pipes/strip-html-with-exception';

/**
 * Component which displays deafult data for the left side column
 */
@Component({
    selector: 'app-default-result-item',
    templateUrl: './default-result-item.component.html',
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        TooltipDirective,
        NotesComponent,
        NgFor,
        KeywordsComponent,
        LowerCasePipe,
        TranslatePipe,
        LocalizeRouterPipe,
        SanitizeHtmlPipe,
        StripHtmlWithExceptionPipe,
    ],
})
export class DefaultResultItemComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * dataset item to display
   */
  @Input() item: any;

  /**
   * flag to indicate if notes should be displayed
   */
  @Input() showNotes = true;

  /**
   * url router link
   */
  @Input() detailsUrl: string | Array<string>;

  /**
   * query params object
   */
  @Input() queryParams: Params;

  /**
   * List of translations keys for applied filters (params)
   */
  appliedFiltersNames: string[] = [];

  /**
   * determinate if list is called from /dataset route
   */
  @Input() fromDatasetEndpoint = false;

  constructor(private mapParamsToTranslationKeysService: MapParamsToTranslationKeysService) {}

  /**
   * gets filters names if item has params
   */
  ngOnInit() {
    if (!this.queryParams) {
      return;
    }
    this.appliedFiltersNames = this.mapParamsToTranslationKeysService.getFiltersTranslations(this.queryParams);
  }
}

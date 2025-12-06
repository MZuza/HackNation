import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { LicensesService } from '@app/services/licenses.service';
import { LicenseWithRules, ZeroLicense } from '@app/services/models/license';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Dataset Restrictions Component
 */
@Component({
  selector: 'app-dataset-restrictions',
  templateUrl: './dataset-restrictions.component.html',
  providers: [LicensesService],
  animations: [toggleVertically],
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    SanitizeHtmlPipe,
    NgForOf
  ]
})
export class DatasetRestrictionsComponent implements OnInit {
  /**
   * Dataset
   */
  @Input() dataset: any;
  /**
   * Is content collapsible
   */
  @Input() isCollapsible = false;

  /**
   * Is for dataset or resource
   */
  @Input() isForDataset = true;

  /**
   * Determines whether dataset has restrictions
   */
  hasRestrictions: boolean;
  /**
   * Current state - is expanded
   */
  isExpanded = true;

  /**
   * License
   * @type {ZeroLicense | LicenseWithRules}
   */
  license: ZeroLicense | LicenseWithRules;

  /**
   * @ignore
   */
  constructor(private readonly licensesService: LicensesService) {}

  /**
   * Expands container on init.
   * Checks whether provided dataset has restrictions
   * Gets license
   */
  ngOnInit(): void {
    if (this.isCollapsible) {
      this.isExpanded = false;
    }

    this.checkDatasetRestrictions();
    this.licensesService.getLicense(this.dataset.attributes.license_name).subscribe(res => {
      this.license = res;
    });
  }

  /**
   * Determines whether related dataset has restrictions
   */
  private checkDatasetRestrictions(): void {
    if (!this.dataset) {
      return;
    }

    this.hasRestrictions =
      this.dataset.attributes?.license_condition_source ||
      this.dataset.attributes?.license_condition_original ||
      this.dataset.attributes?.license_condition_modification ||
      this.dataset.attributes?.license_condition_responsibilities ||
      this.dataset.attributes?.license_condition_db_or_copyrighted ||
      this.dataset.attributes?.license_condition_cc40_responsibilities ||
      this.dataset.attributes?.license_condition_personal_data;
  }
}

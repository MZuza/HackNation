import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { ArrayHelper } from '@app/shared/helpers';

/**
 * Dataset Parent Component
 */
@Component({
  selector: 'app-dataset-parent',
  templateUrl: './dataset-parent.component.html',
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class DatasetParentComponent implements OnInit {
  /**
   * Dataset  of dataset parent component
   */
  dataset;

  /**
   * @ignore
   */
  constructor(private activatedRoute: ActivatedRoute) {}

  /**
   * Initializes dataset.
   */
  ngOnInit() {
    this.dataset = this.activatedRoute.snapshot.data['post'].data;
    this.dataset.attributes['tags'] = this.dataset.attributes['tags'] ? this.convertTagsToString() : '';
  }

  /**
   * Converts tags attributes to comma separated string
   */
  private convertTagsToString(): string {
    return ArrayHelper.convertArrayValuesToCommaSeparatedString(this.dataset.attributes['tags']);
  }
}

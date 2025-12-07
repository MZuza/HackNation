import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Displays star rating based on number
 * @example
 * <app-star-rating [rating]="3" [max]="5"></app-star-rating>
 * // Outputs: ★ ★ ★ ☆ ☆
 */
@Component({
    selector: 'app-star-rating',
    templateUrl: './star-rating.component.html',
    standalone: true,
    imports: [NgFor, NgClass],
})
export class StarRatingComponent implements OnInit {
  /**
   * Current rating of an item
   */
  @Input() rating: number;

  /**
   * **Optional**. Maximum possible rating (default: 5)
   */
  @Input() max: number = 5;

  /**
   * @ignore
   */
  ratesArr: number[] = [];

  /**
   * @ignore
   */
  constructor() {}

  /**
   * @ignore
   */
  ngOnInit() {
    for (let i = 0; i < this.max; i++) {
      this.ratesArr.push(i + 1);
    }
  }
}

import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Tour progress component
 */
@Component({
    selector: 'app-tour-progress',
    templateUrl: './tour-progress.component.html',
    standalone: true,
    imports: [NgFor],
})
export class TourProgressComponent {
  /**
   * @ignore
   */
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Steps
   * @type {Array<boolean>}
   */
  @Input()
  steps: Array<boolean>;

  /**
   * Change step
   * @type {EventEmitter<number>}
   */
  @Output()
  changeStep: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Refreshes view
   */
  refresh() {
    this.changeDetectorRef.detectChanges();
  }
}

import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Schedule Status Component
 */
@Component({
    selector: 'app-schedule-status',
    templateUrl: './schedule-status.component.html',
    standalone: true,
    imports: [NgIf],
})
export class ScheduleStatusComponent {
  /**
   * Status completion flag
   */
  @Input()
  isCompleted: boolean;
}

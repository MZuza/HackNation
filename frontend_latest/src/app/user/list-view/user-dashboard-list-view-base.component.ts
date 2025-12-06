import { Component } from '@angular/core';

/**
 * User Dashboard List Container Base Component
 */
@Component({
    selector: 'app-user-dashboard-list-view-base',
    template: '',
    standalone: true,
})
export class UserDashboardListViewBaseComponent {
  /**
   * Tracks list items for better performance
   * @param index
   * @param item
   * @returns {number}
   */
  trackByFn(index: number, item: any): number {
    return item.id;
  }
}

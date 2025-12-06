import { LowerCasePipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations';
import { ObserveService } from '@app/services/observe.service';

/**
 * Activity Notifications Component
 */
@Component({
  selector: 'app-activity-notifications',
  templateUrl: './activity-notifications.component.html',
  animations: [toggleVertically],
  imports: [
    TranslatePipe,
    LowerCasePipe,
    NgIf,
    RouterLink,
    LocalizeRouterPipe
  ],
  standalone: true
})
export class ActivityNotificationsComponent implements OnInit, AfterViewInit {
  /**
   * Determines whether activityNotificationsRef is visible
   */
  isPopupVisible = false;

  /**
   * Datasets count of activity notifications component
   */
  datasetsCount: number = 0;

  /**
   * Search results count of activity notifications component
   */
  searchResultsCount: number = 0;

  /**
   * Total count of activity notifications component
   */
  totalCount = 0;

  /**
   * Click outside listener of activity notifications component
   */
  private clickOutsideListener: () => void;

  /**
   * Click escape listener of activity notifications component
   */
  private clickEscapeListener: () => void;

  /**
   * Popup reference of activity notifications component
   */
  @ViewChild('activity_notifications') activityNotificationsRef: ElementRef;

  /**
   * @ignore
   */
  constructor(private renderer: Renderer2, private observeService: ObserveService) {}

  /**
   * Initializes component data
   */
  ngOnInit() {
    this.observeService.notificationsChanged.subscribe(() => {
      this.getNewNotifications();
    });

    this.getNewNotifications();
  }

  private getNewNotifications() {
    this.observeService.getNewNotifications().subscribe(response => {
      this.resetCounters();

      if (response.meta['notifications']) {
        const changes = response.meta['notifications'];

        if (changes['datasets']) {
          (this.datasetsCount = changes['datasets']['new']);
        }
        if (changes['queries']) {
          (this.searchResultsCount = changes['queries']['new']);
        }

        this.countTotal();
      }
    });
  }

  /**
   * Counts total
   */
  countTotal() {
    this.totalCount = this.datasetsCount + this.searchResultsCount;
  }

  /**
   * Resets counters
   */
  resetCounters() {
    this.totalCount = this.datasetsCount = this.searchResultsCount = 0;
  }

  /**
   * Event listeners for hiding popup
   */
  ngAfterViewInit(): void {
    this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
    this.clickEscapeListener = this.renderer.listen(this.activityNotificationsRef.nativeElement, 'keydown.esc', () => {
      this.isPopupVisible = false;
      this.onPopupBlur();
    });
  }

  /**
   * Click outside event listener. Hides dropdown.
   * @param event
   */
  clickOutside(event) {
    if (!this.activityNotificationsRef) { return; }

    const targetElement = event.target as HTMLElement;
    const parentElement = this.activityNotificationsRef.nativeElement as HTMLElement;
    const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

    if (!clickedInside) {
      this.isPopupVisible = false;
    }
  }

  /**
   * Mark all notifications as read.
   */
  onMarkAllAsRead() {
    this.observeService.markAllAsRead().subscribe(() => {
      location.reload();
    });
  }

  /**
   * Closes popup od keyboard key combination
   */
  onPopupTriggerKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        if (event.shiftKey) {
          this.isPopupVisible = false;
        }
        break;

      case 'Space':
        if (event.shiftKey) {
          this.isPopupVisible = false;
          event.preventDefault();
        }
        break;
    }
  }

  /**
   * Sets focus on popup trigger on popup blur
   */
  onPopupBlur() {
    ((<HTMLElement>this.activityNotificationsRef.nativeElement).children[0] as HTMLButtonElement).focus();
  }
}

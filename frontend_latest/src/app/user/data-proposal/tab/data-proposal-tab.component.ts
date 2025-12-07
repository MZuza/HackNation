import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataProposalListComponent } from '../list/data-proposal-list.component';

/**
 * Data Proposal Tab Component
 */
@Component({
    selector: 'app-data-proposal-tab',
    templateUrl: './data-proposal-tab.component.html',
    standalone: true,
    imports: [
        NgIf,
        DataProposalListComponent,
        RouterOutlet,
    ],
})
export class DataProposalTabComponent implements OnDestroy {
  /**
   * Type of data proposal
   */
  @Input()
  type: string;

  /**
   * Determines if current route has child
   */
  hasChildRoute: boolean;

  private routerEvents$: Subscription;

  constructor(public readonly activeRoute: ActivatedRoute, private readonly router: Router) {
    this.routerEvents$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.hasChildRoute = this.activeRoute.children.length > 0;
    });
  }

  /**
   * Clean subscriptions
   */
  ngOnDestroy() {
    this.routerEvents$.unsubscribe();
  }
}

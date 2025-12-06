import { Component, OnInit } from '@angular/core';
import { DataProposalTabComponent } from '../tab/data-proposal-tab.component';

import { SeoService } from '@app/services/seo.service';

/**
 * Inactive Data Proposal Component
 */

@Component({
    selector: 'app-inactive-data-proposal',
    templateUrl: './inactive-data-proposal.component.html',
    standalone: true,
    imports: [DataProposalTabComponent],
})
export class InactiveDataProposalComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private seoService: SeoService) {}

  /**
   * Sets title in a browser
   */
  ngOnInit(): void {
    this.seoService.setPageTitle(['Nieaktywne', 'Propozycje nowych danych', 'Mój Pulpit']);
  }
}

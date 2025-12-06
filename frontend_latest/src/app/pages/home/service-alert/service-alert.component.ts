import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AbstractService } from '@app/services/abstract.service';
import { ApiConfig } from '@app/services/api';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';

/**
 * Service Alert Component
 */
@Component({
    selector: 'home-service-alert',
    templateUrl: './service-alert.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        TranslatePipe,
        SanitizeHtmlPipe,
    ],
})
export class ServiceAlertComponent implements OnInit {
  /**
   * Service alerts of service alert component
   */
  serviceAlerts;

  /**
   * @ignore
   */
  constructor(private api: AbstractService) {}

  /**
   * Initializes service alert.
   */
  ngOnInit() {
    this.api.getRequest(ApiConfig.stats).subscribe(data => (this.serviceAlerts = data.meta.alerts));
  }
}

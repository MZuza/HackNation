import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressHttp } from 'ngx-progressbar/http';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { filter, take } from 'rxjs/operators';

import { FooterComponent } from '@app/layout/footer/footer.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { RoutingHelper } from '@app/services/commons/routing-helper';
import { TourButtonComponent } from '@app/shared/tour/tour-button/tour-button.component';
import { TourPickerComponent } from '@app/shared/tour/tour-picker/tour-picker.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    TranslatePipe,
    TourPickerComponent,
    NgProgressbar,
    RouterOutlet,
    TourButtonComponent,
    HeaderComponent,
    FooterComponent,
    NgProgressHttp,
    NgProgressRouter
  ],
  standalone: true,
  host: {
    class: 'main-layout'
  }
})
export class MainLayoutComponent {
  isHomepage: boolean;

  /**
   * Checks wheater it is homepage or any other page
   * @param router
   * @param localize
   */
  constructor(private router: Router, private localize: LocalizeRouterService) {
    this.localize.hooks.initialized.pipe(take(1)).subscribe(() => {
      this.isHomepage = RoutingHelper.isHomePage(router.url);
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isHomepage = RoutingHelper.isHomePage(event.url);
    });
  }
}

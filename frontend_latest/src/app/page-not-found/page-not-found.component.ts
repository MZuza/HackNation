import { isPlatformServer, NgIf } from '@angular/common';
import {Component, Inject, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {Router} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';

import {ResponseService} from '@app/ssr/response.service';

/**
 * Page Not Found Component
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [
    NgIf,
    TranslatePipe
  ],
  standalone: true
})
export class PageNotFoundComponent implements OnInit {

  public missingLang: boolean = false;
  private currentLang: string = 'pl';

  constructor(
    @Optional() private readonly responseService: ResponseService,
    @Inject(PLATFORM_ID) private readonly platformId: string,
    private router: Router,
    private cookieService: CookieService
  ) {

  }

  ngOnInit(): void {
    this.setCurrentLang();

    if (isPlatformServer(this.platformId)) {
      this.responseService.setStatusCode(404);
    } else {
      this.handleWrongUrl();
    }
  }

  private setCurrentLang(): void {
    if (this.cookieService.get('currentLang') && ['pl', 'en'].includes(this.cookieService.get('currentLang'))) {
      this.currentLang = this.cookieService.get('currentLang');
    }
  }

  private handleWrongUrl(): void {
    if (this.router.url.startsWith('/pl-en')) {
      return this.redirectToCurrentLang(this.router.url.substr(6));
    }

    if (this.router.url.startsWith('/pl') || this.router.url.startsWith('/en')) {
      return;
    }

    return this.redirectToCurrentLang(this.router.url);
  }

  private redirectToCurrentLang(url: string): void {
    this.missingLang = true;
    this.router.navigateByUrl(`${this.currentLang}${url}`).then(() => {
      this.missingLang = false;
    });
  }
}

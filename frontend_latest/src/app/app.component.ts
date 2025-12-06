import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { RouterEndpoints } from './services/models/routerEndpoints';

import { RoutingHelper } from '@app/services/commons/routing-helper';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { SchemaService } from '@app/services/schema.service';

/**
 * Application Root Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ],
  standalone: true
})
export class AppComponent implements OnInit {

  /**
   * @ignore
   */
  constructor(
    private renderer: Renderer2,
    private location: PlatformLocation,
    private router: Router,
    private localStorage: LocalStorageService,
    private cookieService: CookieService,
    private languageBootstrapService: LanguageBootstrapService,
    private translateService: TranslateService,
    private featureFlagsService: FeatureFlagService,
    private schemaService: SchemaService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}
  /**
   * Homepage flag
   */
  isHomepage: boolean;

  /**
   * User Dashboard flag
   */
  isUserDashboard: boolean;

  /**
   * Resource Page flag
   */
  isResourcePage: boolean;

  /**
   * Back state flag
   */
  private isBackState = false;

  /**
   * Default lang
   */
  private defaultLang = 'pl';

  /**
   * Current Lang Cookie Key
   */
  private currentLangCookieKey = 'currentLang';

  /**
   * Navigation checks and default language setting
   */
  ngOnInit() {
    this.document.documentElement.lang = this.translateService.currentLang;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isResourcePage = event.url.indexOf(RouterEndpoints.RESOURCES) !== -1;
        this.schemaService.removeStructuredData();
      }

      if (event instanceof NavigationEnd) {
        this.isHomepage = RoutingHelper.isHomePage(event.url);
        if (!this.isResourcePage) {
          this.scrollTop();
        }
      }
    });

    this.location.onPopState(() => {
      this.isBackState = true;
    });
  }

  /**
   * Scroll to the top of the page and set focus on the top element
   */
  private scrollTop() {
    if (isPlatformBrowser(this.platformId) && !this.isBackState) {
      window.scrollTo(0, 0);
      document.getElementById('top')?.focus();
    } else {
      this.isBackState = false;
    }
  }
}


import { AsyncPipe, DOCUMENT, isPlatformBrowser, NgClass, NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '@env/environment';
import { LocalizeRouterPipe, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { toggleVertically } from '@app/animations';
import { ActivityNotificationsComponent } from '@app/layout/header/activity-notifications/activity-notifications.component';
import { CmsService } from '@app/services/cms.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { LoginService } from '@app/services/login-service';
import { User } from '@app/services/models';
import { IHome } from '@app/services/models/cms/pages/home';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { BreadcrumbsComponent } from '@app/shared/breadcrumbs/breadcrumbs.component';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';
import { ClickOutsideDirective } from '@app/shared/directives/click-outside.directive';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';
import { FormComponent } from '@app/form/form.component';

/**
 * Header Component
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: 'header.component.scss',
  animations: [toggleVertically],
  imports: [
    TranslatePipe,
    CmsBlock2Component,
    NgClass,
    NgIf,
    NgForOf,
    RouterLink,
    LocalizeRouterPipe,
    RouterLinkActive,
    TooltipDirective,
    AsyncPipe,
    ClickOutsideDirective,
    UpperCasePipe,
    ActivityNotificationsComponent,
    FormComponent,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Previous language
   */
  previousLang: string;

  /**
   * Current language
   */
  currentLang: string;

  /**
   * Menu Collapsed Flag
   */
  isMenuCollapsed = true;

  /**
   * Logged In flag
   */
  loggedIn = false;

  /**
   * User Observable
   */
  user$: Observable<User> = this.userStateService.getCurrentUser();

  /**
   * Single cms widget
   */
  singleCmsWidget: IWidget;
  isListOpen = false;
  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<boolean> = new Subject();

  /**
   * @ignore
   */
  constructor(
    public translate: TranslateService,
    public cmsService: CmsService,
    private userService: UserService,
    private userStateService: UserStateService,
    private cookieService: CookieService,
    private languageBootstrapService: LanguageBootstrapService,
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
    private renderer: Renderer2,
    private highContrastService: HighContrastService,
    private loginService: LoginService,
    private featureFlagService: FeatureFlagService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  /**
   * Initializes logged-in user.
   * Auto closes menu in mobile mode.
   * On language change navigates to home page simulating page refresh
   */
  ngOnInit() {
    this.previousLang = this.translate.currentLang;
    this.currentLang = this.translate.currentLang;

    this.loginService.loggedIn.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
    this.highContrastService.init(this.renderer);
    this.highContrastService
      .getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => (this.highContrastMode = mode));

    // auto close menu in mobile mode
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => !this.isMenuCollapsed && (this.isMenuCollapsed = !this.isMenuCollapsed));

    this.assignCmsSection();
  }

  /**
   * Assigns cms section
   */
  private assignCmsSection() {
    this.cmsService.getHomePageWidgets().subscribe((homeWidgets: IHome) => {
      if (homeWidgets.over_login_section_cb && homeWidgets.over_login_section_cb.length) {
        this.singleCmsWidget = homeWidgets.over_login_section_cb[0];
      }
    });
  }

  /**
   * Logouts and redirects user to the login page when current page requires auth
   */
  logout() {
    this.userService.logout().subscribe(() => {
      this.userStateService.clearCurrentUser();
      const urlsThatRequiresAuth = new RegExp(/\/(user\/)(dashboard)\//);
      if (this.router.url.match(urlsThatRequiresAuth)) {
        this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as []);
      }
    });
  }

  /**
   * Changes language for the entire app.
   * @param language
   */
  useLanguage(language: string) {
    this.currentLang = language;
    this.translate.use(language);
    this.cookieService.set('currentLang', language, undefined, '/');
    this.languageBootstrapService.setBootstrapLanguage(language);
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setAttribute(document.documentElement, 'lang', language);
      window.location.href = '/' + language;
    }
  }

  /**
   * Increases or descreases font size. Improves accessibility for low-vision aids.
   * @param value
   */
  useFontSize(value) {
    // setStyle doesn't work on IE
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setAttribute(document.documentElement, 'class', `font-size-${value}`);
    }
  }

  /**
   * Turns on high contrast. Improves accessibility for low-vision aids.
   * @param value
   */
  useHighContrast(value) {
    this.disableHighContrast();
    if (isPlatformBrowser(this.platformId)) {
      this.highContrastService.useHighContrast(value);
    }
  }

  /**
   * Disables high contrast.
   */
  disableHighContrast() {
    if (isPlatformBrowser(this.platformId)) {
      this.highContrastService.disableHighContrast();
    }
  }

  /**
   * Skip links navigation handler.
   * Improves accessibility without mouse.
   * @param elementId
   * @param event
   */
  skipTo(elementId: string, event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById(elementId).focus();
    }
  }

  checkIfLinkedAccounts(accountsTable: string[]): boolean {
    return accountsTable?.length !== 0;
  }

  toggleList(): void {
    setTimeout(() => {
      this.isListOpen = !this.isListOpen;
    }, 50);
  }
  clickedOutside(): void {
    this.isListOpen = false;
  }

  switchAccount(newEmail: string): void {
    if (environment.production) {
      const currentUrl = this.document.location.hostname.replace('www.', '');
      window.location.href = `https://admin.${currentUrl}/logingovpl/switch?email=${newEmail}`;
    } else {
      window.location.href = `https://admin.mcod.local/logingovpl/switch?email=${newEmail}`;
    }
  }

  isMorePagesActive(): string {
    if (this.router.url.includes('brokenlinks') || this.router.url.includes('article')) {
      return 'active';
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

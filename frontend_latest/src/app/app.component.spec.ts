import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LocalStorageService } from 'ngx-localstorage';
import { AppComponent } from './app.component';

import { AppRoutingModule } from '@app/app-routing.module';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { FooterNavLinkExternalComponent } from '@app/layout/footer/footer-nav-link-external/footer-nav-link-external.component';
import { FooterNavLinkInternalComponent } from '@app/layout/footer/footer-nav-link-internal/footer-nav-link-internal.component';
import { FooterNavListComponent } from '@app/layout/footer/footer-nav-list/footer-nav-list.component';
import { FooterComponent } from '@app/layout/footer/footer.component';
import { ActivityNotificationsComponent } from '@app/layout/header/activity-notifications/activity-notifications.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
import { HomeModule } from '@app/pages/home/home.module';
import { PreviewCmsComponent } from '@app/pages/preview-cms/preview-cms.component';
import { RegulationsComponent } from '@app/pages/regulations/regulations.component';
import { SearchResultsComponent } from '@app/pages/search-results/search-results.component';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { SurveyComponent } from '@app/pages/survey/survey.component';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { SharedModule } from '@app/shared/shared.module';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';
import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';
import { UnsubcribeNewsletterComponent } from '@app/user/newsletter/unsubcribe-newsletter/unsubcribe-newsletter.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/api' },
        { provide: LocalStorageService, useValue: LocalStorageService },
        { provide: HttpClient, useValue: HttpClient },
        { provide: BsLocaleService, useValue: BsLocaleService },
        { provide: LanguageBootstrapService, useValue: LanguageBootstrapService },
      ],
      imports: [
        AppComponent,
        HeaderComponent,
        ActivityNotificationsComponent,
        FooterComponent,
        FooterNavLinkExternalComponent,
        FooterNavLinkInternalComponent,
        FooterNavListComponent,
        PreviewCmsComponent,
        RegulationsComponent,
        SitemapComponent,
        MainLayoutComponent,
        EmbedLayoutComponent,
        EmbeddedComponent,
        PageNotFoundComponent,
        NewsletterComponent,
        ActiveNewsletterComponent,
        UnsubcribeNewsletterComponent,
        SearchResultsComponent,
        SurveyComponent,
        HomeModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on the page.
        BrowserModule.withServerTransition({ appId: 'otwarte-dane-ssr' }),
        AppRoutingModule,
        TranslateModule.forRoot({}),
        LocalizeRouterModule.forRoot([]),
      ],
    }).compileComponents();
  });

  it('should create the app', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render main tag with router-outlet', fakeAsync(() => {
    inject([LocalStorageService], (localstorage: LocalStorageService) => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement as HTMLElement;

      expect(compiled.querySelector('router-outlet').innerHTML).toBeDefined();
    });
  }));
});

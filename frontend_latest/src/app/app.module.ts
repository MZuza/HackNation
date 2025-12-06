import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
//  runtime information about the current platform and the appId by injection.
import { APP_ID, Inject, NgModule, PLATFORM_ID, TransferState } from '@angular/core';
import { environment } from '@env/environment';
import { TranslatePipe } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { FooterNavLinkExternalComponent } from './layout/footer/footer-nav-link-external/footer-nav-link-external.component';
import { FooterNavLinkInternalComponent } from './layout/footer/footer-nav-link-internal/footer-nav-link-internal.component';
import { FooterNavListComponent } from './layout/footer/footer-nav-list/footer-nav-list.component';
import { DeclarationComponent } from './pages/declaration/declaration.component';
import { PreviewCmsComponent } from './pages/preview-cms/preview-cms.component';
import { RegulationsComponent } from './pages/regulations/regulations.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SurveyComponent } from './pages/survey/survey.component';

import { APP_CONFIG } from '@app/app.config';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { CmsFormComponent } from '@app/shared/cms/cms-forms/cms-form/cms-form.component';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';
import {
  FoundResultsCountersAndSortComponent
} from '@app/shared/found-results-counters-and-sort/found-results-counters-and-sort.component';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { NoResultsFoundComponent } from '@app/shared/no-results-found/no-results-found.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { SearchResultsViewComponent } from '@app/shared/result-list/results/search-results-view/search-results-view.component';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';
import { TranslateBrowserLoaderService } from '@app/ssr/translate-browser-loader.service';

export function flagsFactory(featureFlagService: FeatureFlagService) {
  return () => featureFlagService.initialize();
}
Sentry.init({
  dsn: 'https://23ce4d6805ae4ba0ae5954f33aaf9246@apm.dane.gov.pl//12',
  environment: environment.name,
  tracesSampleRate: 1.0,
});

@NgModule({
  imports: [
    RegulationsComponent,
    PreviewCmsComponent,
    SearchResultsComponent,
    SurveyComponent,
    TranslatePipe,
    NotificationsServerComponent,
    FoundResultsCountersAndSortComponent,
    NgIf,
    SearchSuggestComponent,
    LoaderComponent,
    SearchResultsViewComponent,
    NoResultsFoundComponent,
    ItemsPerPageComponent,
    PaginationComponent,
    CmsStaticPageComponent,
    NgClass,
    FooterNavListComponent,
    FooterNavLinkInternalComponent,
    FooterNavLinkExternalComponent,
    DeclarationComponent,
    CmsFormComponent
  ],
  // bootstrap: [AppComponent], imports: [
  //   // Add .withServerTransition() to support Universal rendering.
  //   // The application ID can be any identifier which is unique on the page.
  //   BrowserModule.withServerTransition({appId: 'otwarte-dane-ssr'}),
  //   TransferHttpCacheModule,
  //   AppRoutingModule,
  //   AppBootstrapModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  //   HomeModule,
  //   ServicesModule.forRoot(),
  //   SharedModule,
  //   ModalModule.forRoot(),
  //   TabsModule.forRoot(),
  //   AccordionModule.forRoot(),
  //   TooltipModule.forRoot(),
  //   TranslateModule.forChild(),
  //   BrowserAnimationsModule,
  //   KnowledgeBaseModule,
  //   NgxMatomoTrackerModule,
  //   NgxMatomoRouterModule,
  //   UnsubcribeNewsletterComponent,
  //   NgProgressbar,
  //   MainLayoutComponent,
  //   HeaderComponent,
  //   FooterComponent,
  //   EmbedLayoutComponent,
  //   PageNotFoundComponent,
  //   SitemapComponent,
  //   ActivityNotificationsComponent,
  //   NewsletterComponent,
  //   ActiveNewsletterComponent,
  //   AppComponent
  // ],
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, trace: Sentry.TraceService) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    //console.log(`Running ${platform} with appId=${appId}`);
  }
}

export function HttpLoaderFactory(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoaderService(http, transferState);
}

export function matomoConfigFactory(platformId: Object) {
  let matomoSiteId: string;
  if (isPlatformBrowser(platformId)) {
    switch (document.location.hostname) {
      case 'dane.gov.pl':
        matomoSiteId = '5';
        break;
      case 'localhost':
      case 'dev.dane.gov.pl':
        matomoSiteId = '2';
        break;
      case 'int.dane.gov.pl':
        matomoSiteId = '3';
        break;
      case 'szkolenia.dane.gov.pl':
        matomoSiteId = '4';
        break;
    }
  }

  return {
    disabled: !isPlatformBrowser(platformId),
    siteId: matomoSiteId,
    trackerUrl: APP_CONFIG.matomoTrackerUrl,
  };
}

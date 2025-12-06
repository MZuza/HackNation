import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withNoXsrfProtection } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HomepageInterceptorService } from './homepage-interceptor.service';

import { AbstractService } from '@app/services/abstract.service';
import { ApplicationsService } from '@app/services/applications.service';
import { DatasetService } from '@app/services/dataset.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { DaterangeFilterService } from '@app/services/filters/daterange-filter.service';
import { ListViewManageFiltersService } from '@app/services/filters/list-view-manage-filters.service';
import { MultiselectFilterService } from '@app/services/filters/multiselect-filter.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { LicensesService } from '@app/services/licenses.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { MapParamsToTranslationKeysService } from '@app/services/map-params-to-translation-keys.service';
import { NominatimGeocodeService } from '@app/services/nominatim-geocode.service';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { SearchHistoryService } from '@app/services/search-history.service';
import { HttpXsrfModule } from '@app/services/security/http-xsrf.module';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';

/**
 * Global Service Module that imports all services
 */
@NgModule({ imports: [CommonModule, HttpXsrfModule.forRoot()], providers: [
        NotificationsService,
        NotificationsFrontService,
        DatasetService,
        ApplicationsService,
        InstitutionsService,
        UserService,
        ApplicationsService,
        AbstractService,
        SeoService,
        SearchHistoryService,
        ObserveService,
        NominatimGeocodeService,
        MapParamsToTranslationKeysService,
        { provide: HTTP_INTERCEPTORS, useClass: HomepageInterceptorService, multi: true },
        provideHttpClient(withNoXsrfProtection()),
    ] })
export class ServicesModule {
  constructor(@Optional() @SkipSelf() parentModule: ServicesModule) {
    if (parentModule) {
      throw new Error('ServicesModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<ServicesModule> {
    return {
      ngModule: ServicesModule,
      providers: [
        NotificationsService,
        DatasetService,
        LicensesService,
        ApplicationsService,
        InstitutionsService,
        UserService,
        ApplicationsService,
        AbstractService,
        SeoService,
        ObserveService,
        FeatureFlagService,
        NominatimGeocodeService,
        ListViewFiltersService,
        ListViewManageFiltersService,
        ListViewSelectedFilterService,
        MultiselectFilterService,
        DaterangeFilterService,
      ],
    };
  }
}

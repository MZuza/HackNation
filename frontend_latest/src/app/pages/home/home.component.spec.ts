import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { NewsComponent } from './news/news.component';
import { SearchComponent } from './search/search.component';
import { ServiceAlertComponent } from './service-alert/service-alert.component';
import { StatsComponent } from './stats/stats.component';

import { AppTestingModule } from '@app/app.testing.module';
import { ApplicationsComponent } from '@app/pages/home/applications/applications.component';
import { ServicesModule } from '@app/services/services.module';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { SharedModule } from '@app/shared/shared.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        ServicesModule,
        TranslateModule.forRoot({}),
        LocalizeRouterModule.forRoot([]),
        HomeComponent,
        SearchComponent,
        CategoriesComponent,
        StatsComponent,
        InstitutionsComponent,
        NewsComponent,
        ServiceAlertComponent,
        ApplicationsComponent,
        FooterComponent
      ],
      providers: [
        CookieService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { provideNgxLocalstorage } from 'ngx-localstorage';

import { AppTestingModule } from '@app/app.testing.module';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { NotificationsService } from '@app/services/notifications.service';
import { UserService } from '@app/services/user.service';
import { SharedModule } from '@app/shared/shared.module';
import { TourDataService } from '@app/shared/tour/tour-data.service';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        MainLayoutComponent
      ],
      providers: [
        provideNgxLocalstorage({prefix: 'mcod'}),
        importProvidersFrom(AppTestingModule),
        UserService,
        NotificationsService,
        LanguageBootstrapService,
        TourDataService
      ]
    });
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

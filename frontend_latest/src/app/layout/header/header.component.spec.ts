import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalizeRouterModule, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { of } from 'rxjs/internal/observable/of';
import { HeaderComponent } from './header.component';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsService } from '@app/services/cms.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { NotificationsService } from '@app/services/notifications.service';
import { UserService } from '@app/services/user.service';
import { SharedModule } from '@app/shared/shared.module';

class NotificationsServiceStub {
  clearAlerts() {}
  getAlerts() {
    return of([]);
  }
}

class UserServiceStub {
  logout() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cmsService: CmsService;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        HeaderComponent
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        CmsService,
        LanguageBootstrapService,
        BsLocaleService,
        LocalizeRouterService,
        importProvidersFrom(AppTestingModule)
      ],
      teardown: {destroyAfterEach: false}
    }).compileComponents();
    cmsService = TestBed.inject(CmsService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should logout', async () => {
    const spyFunction = jest.spyOn(userService, 'logout').mockReturnValue(of({}));
    component.logout();

    expect(spyFunction).toHaveBeenCalled();
  });

  it('should change language for the entire app', fakeAsync (() => {
    const language = 'en';
    component.useLanguage(language);

    expect(component.currentLang).toEqual('en');
  }));

  it('should set language for the entire app to PL', fakeAsync( () => {
    const language = 'pl';
    component.useLanguage(language);

    expect(component.currentLang).toEqual('pl');
  }));
});

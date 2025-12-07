import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { NotificationsFrontComponent } from '@app/shared/notifications-front/notifications-front.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { LoginComponent } from '@app/user/auth/login/login.component';

class NotificationsServiceStub {
  clearAlerts() {}
  getAlerts() {
    return of([]);
  }
}
class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class UserServiceStub {
  getCsrfToken() {
    return EMPTY;
  }
  login() {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: UserService;
  const credentials = {
    email: 'user.email@example.com',
    password: 'Example.1',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        NoopAnimationsModule,
        LoginComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsFrontService,
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        importProvidersFrom(AppTestingModule)
      ],
    });

    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid before email and password is provided', () => {
    fixture.detectChanges();

    const emailButton: HTMLLinkElement = fixture.nativeElement.querySelector('#email-button');
    emailButton.click();

    fixture.detectChanges();

    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
  });

  it('should display required error messages when fields touched and left empty', () => {
    fixture.detectChanges();
    const emailButton: HTMLLinkElement = fixture.nativeElement.querySelector('#email-button');
    emailButton.click();
    fixture.detectChanges();

    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    let emailError: HTMLSpanElement;
    let passwordError: HTMLSpanElement;
    let submitBtn: HTMLButtonElement;

    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // field have been touched
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    emailError = fixture.nativeElement.querySelector('#email_error');
    passwordError = fixture.nativeElement.querySelector('#password_error');
    submitBtn = fixture.nativeElement.querySelector('.btn');
    console.log(emailError.textContent, passwordError.textContent);

    expect(emailError.textContent).toBeTruthy();
    expect(passwordError.textContent).toBeTruthy();
    expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
  });

  it('should be valid after email and password is provided', fakeAsync(() => {
    component.isEmailLoginChoose = true;
    fixture.detectChanges();
    tick(10);
    fixture.whenStable().then(() => {
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      let submitBtn: HTMLButtonElement;

      emailInput.value = credentials.email;
      passwordInput.value = credentials.password;
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn = fixture.nativeElement.querySelector('#submit-button');
      expect(submitBtn.classList.contains('btn-primary')).toBeTruthy();
    });
  }));

  it('should not log in user (call the service) on submit when no credentials provided', () => {
    const emailButton: HTMLLinkElement = fixture.nativeElement.querySelector('#email-button');
    emailButton.click();
    fixture.detectChanges();

    const spy = jest.spyOn(service, 'login');
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
    let submitBtn: HTMLButtonElement;

    emailInput.value = '';
    passwordInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('.btn');
    submitBtn.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should log in user (call the service) on submit', fakeAsync( inject([Router], async (router: Router) => {
    component.redirectUrl = 'user/dashboard';
    fixture.detectChanges();

    const spy = jest.spyOn(service, 'login').mockImplementation();
    const routerNavigationSpy = jest.spyOn(router, 'navigateByUrl');
    const emailButton: HTMLLinkElement = fixture.nativeElement.querySelector('#email-button');
    emailButton.click();
    fixture.detectChanges();
    tick(10);

    fixture.whenStable().then(() => {
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
      const rememberCheck: HTMLInputElement = fixture.nativeElement.querySelector('#rememberCheck');
      let submitBtn: HTMLButtonElement;

      emailInput.value = credentials.email;
      passwordInput.value = credentials.password;
      rememberCheck.checked = false;

      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      rememberCheck.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      submitBtn = fixture.nativeElement.querySelector('#submit-button');
      submitBtn.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(credentials.email, credentials.password, false);
      // TODO fix test
      // expect(routerNavigationSpy).toHaveBeenCalled();
    });
  })));

  it('should NOT submit (not call the service) when the form is invalid', () => {
    const testForm = <NgForm>{ invalid: true };

    const spy = jest.spyOn(service, 'login');
    component.onSubmit(testForm);
    expect(spy).not.toHaveBeenCalled();
  });
});

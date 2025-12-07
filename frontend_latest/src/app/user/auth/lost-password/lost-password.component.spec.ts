import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { NotificationsFrontComponent } from '@app/shared/notifications-front/notifications-front.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { LostPasswordComponent } from '@app/user/auth/lost-password/lost-password.component';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class UserServiceStub {
  forgotPass() {}
}

describe('LostPasswordComponent', () => {
  let component: LostPasswordComponent;
  let fixture: ComponentFixture<LostPasswordComponent>;
  let service: UserService;
  const userEmail = 'user.email@example.com';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        NoopAnimationsModule,
        LostPasswordComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsFrontService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(LostPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display email error when form touched and left empty', () => {
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // field have been touched
    fixture.detectChanges();

    const emailError: HTMLSpanElement = fixture.nativeElement.querySelector('#email_error');
    submitBtn = fixture.nativeElement.querySelector('.btn');

    expect(emailError).toBeTruthy();
    expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
  });

  it('should be valid when email is provided', () => {
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = userEmail;
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('.btn');
    expect(submitBtn.classList.contains('btn-primary')).toBeTruthy();
  });

  it('should change password (call the service) on submit', () => {
    const spy = jest.spyOn(service, 'forgotPass').mockImplementation(() => of(true));
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = userEmail;
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('.btn');
    submitBtn.click();

    expect(spy).toHaveBeenCalled();
    expect(component.mailSent).toBeTruthy();
  });
});

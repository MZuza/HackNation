import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { NotificationsFrontComponent } from '@app/shared/notifications-front/notifications-front.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { ResetPasswordComponent } from '@app/user/auth/reset-password/reset-password.component';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class UserServiceStub {
  passwordCustomValidators: string[] = [];
  resetPass() {}
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        ResetPasswordComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: FormBuilder, useClass: FormBuilder },
        NotificationsFrontService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create a form with 2 controls and all should be required', () => {
    expect(component.resetPasswordForm.get('new_password1').setValue('')).toBeFalsy();
    expect(component.resetPasswordForm.get('new_password2').setValue('')).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    const spy = jest.spyOn(service, 'resetPass').mockImplementation(() => EMPTY);
    component.onSubmitNewPassword();
    expect(spy).not.toHaveBeenCalled();
    expect(component.passwordChanged).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    const spy = jest.spyOn(service, 'resetPass').mockReturnValue(of({}));
    component.resetPasswordForm.setValue({
      new_password1: 'Example.1',
      new_password2: 'Example.2',
    });
    component.onSubmitNewPassword();
    expect(component.resetPasswordForm.valid).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(component.passwordChanged).toBeTruthy();
  });

  it('should stores token of token form submit', () => {
    const testForm = <NgForm>{
      value: {
        code: '45tghj',
      },
    };
    component.onSubmitTokenForm(testForm);
    expect(component.token).toEqual('45tghj');
  });

  // it.skip('should fill required fields and the form should be valid', () => {
  //   component.resetPasswordForm.setValue({
  //     new_password1: 'Example.1',
  //     new_password2: 'Example.2',
  //   });
  //   expect(component.resetPasswordForm.valid).toBeTruthy();
  // });
});

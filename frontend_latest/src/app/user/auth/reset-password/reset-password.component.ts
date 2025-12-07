import { LowerCasePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { VisualPasswordValidatorComponent } from '../visual-password-validator/visual-password-validator.component';

import { toggleVertically } from '@app/animations';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { CustomFormControlValidators } from '@app/shared/form-validators/string.validators';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { equalValueValidator } from '@app/user/auth/equal-value-validator';

/**
 * Reset Password Component
 */
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        NgClass,
        ReactiveFormsModule,
        NotificationsServerComponent,
        VisualPasswordValidatorComponent,
        RouterLink,
        UpperCasePipe,
        LowerCasePipe,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  /**
   * User subscription of reset password component
   */
  userSubscription: Subscription;

  /**
   * Reset password form of reset password component
   */
  resetPasswordForm: UntypedFormGroup;
  /**
   * Token form received email
   */
  token: string;

  /**
   * Determines whether password  has been changed
   */
  passwordChanged: boolean = false;

  /**
   * Determines password min length
   */
  passwordMinLength: number;

  /**
   * Determines whether to show password hint
   */
  showPasswordHint: boolean = false;

  /**
   * @ignore
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private userService: UserService,
    private seoService: SeoService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes reset password form and its validators.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['User.NewPasswordCreation']);
    this.token = this.route.snapshot.paramMap.get('token');

    this.passwordMinLength = this.userService.passwordMinLength;
    const customValidators = this.userService.passwordCustomValidators.map(validator => {
      return CustomFormControlValidators.checkString(validator[0], validator[1]);
    });

    this.resetPasswordForm = this.formBuilder.group(
      {
        new_password1: ['', [Validators.required, Validators.minLength(this.userService.passwordMinLength), ...customValidators]],
        new_password2: ['', Validators.required],
      },
      { validator: equalValueValidator('new_password1', 'new_password2') },
    );
  }

  /**
   * Stores token of token form submit
   * @param {NgForm} tokenForm
   */
  onSubmitTokenForm(tokenForm: NgForm) {
    this.token = tokenForm.value.code;
  }

  /**
   * Resets password on reset password form submit. Clears API errors (if any).
   */
  onSubmitNewPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.notificationsService.clearAlerts();

    this.userSubscription = this.userService.resetPass(this.token, this.resetPasswordForm.value).subscribe(() => {
      this.passwordChanged = true;
    });
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.userSubscription && this.userSubscription.unsubscribe();
  }
}

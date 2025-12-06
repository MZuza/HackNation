import { LowerCasePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { VisualPasswordValidatorComponent } from '../auth/visual-password-validator/visual-password-validator.component';

import { toggleVertically } from '@app/animations';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { CustomFormControlValidators } from '@app/shared/form-validators/string.validators';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { equalValueValidator } from '@app/user/auth/equal-value-validator';

/**
 * Change Password Component
 */
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NotificationsServerComponent,
      NgClass,
      NgIf,
      VisualPasswordValidatorComponent,
      UpperCasePipe,
      LowerCasePipe,
      TranslatePipe
    ]
})
export class ChangePasswordComponent implements OnInit {

    /**
     * Change password form of change password component
     */
    changePasswordForm: UntypedFormGroup;

    /**
     * Determines password min length
     */
    passwordMinLength = 8;

    /**
     * Determines whether to show password hint
     */
    showPasswordHint = false;

    /**
     * @ignore
     */
    constructor(private formBuilder: UntypedFormBuilder,
                private notificationsService: NotificationsService,
                private notificationsFrontService: NotificationsFrontService,
                private userService: UserService,
                private seoService: SeoService,
                private translate: TranslateService,
                private localizeRouterService: LocalizeRouterService,
                private router: Router) {
    }

    /**
     * Sets META tags (title).
     * Initializes change password form and its validators.
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['User.PasswordChange', 'MyDashboard.Self']);

        this.passwordMinLength = this.userService.passwordMinLength;
        const customValidators = this.userService.passwordCustomValidators.map(validator => {
            return CustomFormControlValidators.checkString(validator[0], validator[1]);
        });

        this.changePasswordForm = this.formBuilder.group({
                'old_password': ['', Validators.required],
                'new_password1': ['', [
                    Validators.required,
                    Validators.minLength(this.userService.passwordMinLength),
                    ...customValidators
                ]],
                'new_password2': ['', Validators.required]
            },
            { validator: equalValueValidator('new_password1', 'new_password2') }
        );
    }

    /**
     * Changes password on form submit. Clears API errors (if any).
     */
    onSubmit() {
        this.notificationsService.clearAlerts();

        this.userService.changePassword(this.changePasswordForm.value)
            .subscribe(() => {
                this.userService.logout().subscribe(() => {
                    this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as []);
                });
                this.notificationsFrontService.addSuccess(this.translate.instant('User.PasswordChanged'));
            });
    }
}

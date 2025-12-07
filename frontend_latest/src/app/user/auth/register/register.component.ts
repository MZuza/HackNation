import { LowerCasePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { equalValueValidator } from '../equal-value-validator';
import { VisualPasswordValidatorComponent } from '../visual-password-validator/visual-password-validator.component';

import { toggleVertically } from '@app/animations';
import { IRegistration } from '@app/services/models';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { CustomFormControlValidators } from '@app/shared/form-validators/string.validators';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { RodoModalComponent } from '@app/shared/rodo-modal/rodo-modal.component';

/**
 * Register Component
 */
@Component({
    templateUrl: './register.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        NotificationsServerComponent,
        NgClass,
        VisualPasswordValidatorComponent,
        RodoModalComponent,
        UpperCasePipe,
        LowerCasePipe,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class RegisterComponent implements OnInit {
  /**
   * Registration form of register component
   */
  registrationForm: UntypedFormGroup;

  /**
   * Determines whether a user is registered
   */
  isRegistered = false;

  /**
   * Determines password min length
   */
  passwordMinLength: number;

  /**
   * Determines whether to show password hint
   */
  showPasswordHint = false;

  rodoModalRef: BsModalRef;
  @ViewChild('rodoModalTemplate') modalTemplate: TemplateRef<any>;

  /**
   * Rodo modal trigger (button) reference
   */
  @ViewChild('rodoModalTrigger', { static: false }) rodoModalTrigger: ElementRef;

  /**
   * @ignore
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private seoService: SeoService,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes registration form and its validators.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Action.Register']);

    this.passwordMinLength = this.userService.passwordMinLength;
    const customValidators = this.userService.passwordCustomValidators.map(validator => {
      return CustomFormControlValidators.checkString(validator[0], validator[1]);
    });

    this.registrationForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password1: ['', [Validators.required, Validators.minLength(this.userService.passwordMinLength), ...customValidators]],
        password2: ['', Validators.required],
        rodoConsent: [false, Validators.requiredTrue],
        regulationsConsent: [false, Validators.requiredTrue],
      },
      { validator: equalValueValidator('password1', 'password2') },
    );
  }

  /**
   * Registers a user on form submit. Clears API errors (if any).
   */
  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    this.notificationsService.clearAlerts();
    const { email, password1, password2 } = this.registrationForm.value as IRegistration;

    this.userService
      .registerUser({
        email,
        password1,
        password2,
        subscriptions_report_opt_in: true,
        rodo_privacy_policy_opt_in: true,
      })
      .subscribe(() => {
        this.isRegistered = true;
      });
  }

  onRodoModalOpen(event) {
    event.preventDefault();
    this.rodoModalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });
  }

  onRodoModalClose() {
    this.rodoModalRef.hide();
    (<HTMLButtonElement>this.rodoModalTrigger.nativeElement).focus();
  }
}

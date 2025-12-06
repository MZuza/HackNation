import { LowerCasePipe, NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { toggleVertically } from '@app/animations';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';

/**
 * Lost Password Component
 */
@Component({
    selector: 'app-lost-password',
    templateUrl: './lost-password.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        FormsModule,
        NgIf,
        NotificationsServerComponent,
        NgClass,
        UpperCasePipe,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class LostPasswordComponent implements OnInit, OnDestroy {
  /**
   * Forgotten password subscription of lost password component
   */
  forgottenPasswordSubscription: Subscription;

  /**
   * Form submission availability indicator
   */
  isSubmitDisabled = false;

  /**
   * Determines whether lost password message Was sent
   */
  mailSent = false;

  /**
   * @ignore
   */
  constructor(private notificationsService: NotificationsService, private userService: UserService, private seoService: SeoService) {}

  /**
   * Sets META tags (title).
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['User.NewPasswordCreation']);
  }

  /**
   * Sends mail regarding lost password on form submit
   * @param {NgForm} form
   */
  onSubmit(form: NgForm) {
    this.notificationsService.clearAlerts();
    this.isSubmitDisabled = true;

    this.forgottenPasswordSubscription = this.userService.forgotPass(form.value).subscribe(() => {
      this.isSubmitDisabled = false;
      this.mailSent = true;
    });
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.notificationsService.clearAlerts();

    if (this.forgottenPasswordSubscription) {
      this.forgottenPasswordSubscription.unsubscribe();
    }
  }
}

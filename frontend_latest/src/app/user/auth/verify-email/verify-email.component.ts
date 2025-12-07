import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';

import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';

/**
 * Verify Email Component
 */
@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        NotificationsServerComponent,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  /**
   * Determines whether email has been verified
   */
  isVerified: boolean;
  userSubscription: Subscription;

  /**
   * @ignore
   */
  constructor(private route: ActivatedRoute, private seoService: SeoService, private userService: UserService) {}

  /**
   * Sets META tags (title).
   * Verifies email based on provided token.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Action.Register']);
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) { return; }

    this.userSubscription = this.userService.verifyEmail(token).subscribe(() => {
      this.isVerified = true;
    });
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}

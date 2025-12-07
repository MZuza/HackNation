import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { HttpCustomErrorResponse } from '@app/services/models';
import { NewsletterService } from '@app/services/newsletter.service';
import { LinkButtonComponent } from '@app/shared/buttons/link-button/link-button.component';

@Component({
  selector: 'app-verify-newsletter',
  templateUrl: './active-newsletter.component.html',
  imports: [
    TranslatePipe,
    LinkButtonComponent,
    LocalizeRouterPipe
  ],
  standalone: true
})
export class ActiveNewsletterComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    successMessage: string;
    errorMessage: string;
    DOT = '.';

    constructor(private route: ActivatedRoute,
                private newsletterService: NewsletterService,
                @Inject(PLATFORM_ID) private platformId: string) {
    }

    ngOnInit() {
        const token = this.route.snapshot.paramMap.get('token');
        if (!token) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {

            this.subscription = this.newsletterService.confirmNewsletterSubscription(token)
                .subscribe((response) => {
                    this.successMessage = response.data.attributes.newsletter_subscription_info;
                }, (customError: HttpCustomErrorResponse) => {
                    this.errorMessage = this.newsletterService.getNewsletterError(customError);
                });
        }
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
          this.subscription.unsubscribe();
        }
    }

}

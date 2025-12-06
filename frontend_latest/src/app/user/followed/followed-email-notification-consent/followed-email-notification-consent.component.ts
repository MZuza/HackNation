import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {toggleVertically} from '@app/animations';

/**
 * Email notifications Component
 */
@Component({
    selector: 'app-followed-email-notification-consent',
    templateUrl: './followed-email-notification-consent.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [NgIf, TranslatePipe]
})
export class FollowedEmailNotificationConsentComponent {

    /**
     * Emits event to hide consent panel
     */
    @Output() showConsentPanel = new EventEmitter();

    /**
     * Emits event to set user's notifications consent
     */
    @Output() setConsent = new EventEmitter();

    /**
     * Disables/enables accept button
     */
    showAcceptButton = false;

    /**
     * Emits event to hide consent panel
     */
    onCancel() {
        this.showConsentPanel.emit(false);
    }

    /**
     * Emits event to submit notifications
     */
    onSubmit() {
        this.setConsent.emit(true);
    }
}

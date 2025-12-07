import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { ScheduleNotificationRecipientType } from '@app/user/schedule/services/schedule-notification-recipient-type';
import { ScheduleNotificationsService } from '@app/user/schedule/services/schedule-notifications.service';

@Component({
    selector: 'app-schedule-notifications-form',
    templateUrl: './schedule-notifications-form.component.html',
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        NotificationsServerComponent,
        NgClass,
        NgFor,
        TranslatePipe,
    ],
})
export class ScheduleNotificationsFormComponent implements OnInit {
  /**
   * Notification form
   */
  notificationForm: UntypedFormGroup;

  /**
   * Min notification length
   */
  minNotificationLength = 3;

  /**
   * Max notification length
   */
  maxNotificationLength = 60;

  /**
   * Recipient type option list
   */
  recipientTypes: ScheduleNotificationRecipientType[];
  /**
   * Notification sent message
   */
  notificationSentMessage: string;

  /**
   * @ignore
   */
  constructor(private scheduleNotificationsService: ScheduleNotificationsService) {}

  /**
   * Inits the form
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inits the form
   */
  initForm() {
    this.recipientTypes = this.scheduleNotificationsService.getRecipientTypes();

    this.notificationForm = new UntypedFormGroup({
      message: new UntypedFormControl(null, [
        Validators.required,
        Validators.minLength(this.minNotificationLength),
        Validators.maxLength(this.maxNotificationLength),
      ]),
      type: new UntypedFormControl(null),
    });

    if (this.recipientTypes?.length) {
      this.notificationForm.patchValue({ type: this.recipientTypes[1].value });
    }
  }

  /**
   * Submits the form
   */
  onFormSubmit() {
    if (this.notificationForm.invalid) {
      return false;
    }

    this.scheduleNotificationsService.sendNotification(this.notificationForm.value).subscribe(response => {
      this.notificationSentMessage = response.data.attributes.result;
      this.notificationForm.reset();
    });
  }

  /**
   * Toggles form
   */
  onToggleForm() {
    this.notificationSentMessage = null;
  }
}

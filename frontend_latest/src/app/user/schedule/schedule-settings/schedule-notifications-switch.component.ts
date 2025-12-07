import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ScheduleNotificationsFormComponent } from '../forms/schedule-notifications-form/schedule-notifications-form.component';

@Component({
    selector: 'app-schedule-notifications-switch',
    templateUrl: './schedule-notifications-switch.component.html',
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        ScheduleNotificationsFormComponent,
        TranslatePipe,
    ],
})
// tslint:disable-next-line:component-class-suffix
export class ScheduleNotificationsSwitch {
  isSettingsActive = true;

  constructor() {}
}

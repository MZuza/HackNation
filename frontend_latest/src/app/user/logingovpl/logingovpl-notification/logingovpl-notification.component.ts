import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LogingovplErrorEnum } from './logingovpl-error.enum';

import { HighContrastModeEnum } from '@app/services/high-contrast.service';

@Component({
    selector: 'app-logingovpl-notification',
    templateUrl: './logingovpl-notification.component.html',
    styleUrls: ['logingovpl-notification.component.scss'],
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet, NgClass, TranslatePipe]
})
export class LogingovplNotificationComponent implements OnInit {

  @Input() styleClass: string = '';
  @Input() contrastMode: HighContrastModeEnum;
  @Input() hideAfter: number = 0;

  public logingovplQueryCode: LogingovplErrorEnum;
  protected readonly LogingovplErrorEnum: typeof LogingovplErrorEnum = LogingovplErrorEnum;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const logingovplCode: string = this.route.snapshot.queryParamMap.get('logingovpl');
    if (logingovplCode) {
      this.logingovplQueryCode = logingovplCode as LogingovplErrorEnum;
    }

    if (this.hideAfter > 0) {
      setTimeout(() => {
        this.logingovplQueryCode = undefined;
      }, this.hideAfter);
    }
  }
}

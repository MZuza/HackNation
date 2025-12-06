import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogingovplNotificationComponent } from '../logingovpl-notification/logingovpl-notification.component';

import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';

@Component({
    selector: 'app-logingovpl-error-page',
    templateUrl: './logingovpl-error-page.component.html',
    standalone: true,
    imports: [
        LogingovplNotificationComponent,
        RouterLink,
        LocalizeRouterPipe,
        TranslatePipe,
    ],
})
export class LogingovplErrorPageComponent implements OnInit, OnDestroy {
  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private highContrastService: HighContrastService) {}

  ngOnInit() {
    this.highContrastService.getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => this.highContrastMode = mode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

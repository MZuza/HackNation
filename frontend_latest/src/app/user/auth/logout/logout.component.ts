import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';

import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    standalone: true,
    imports: [TranslatePipe],
})
export class LogoutComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private userService: UserService, private localizeRouterService: LocalizeRouterService, private router: Router) {}

  /**
   * Logs out user and redirects to login page
   */
  ngOnInit(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as []);
    });
  }
}

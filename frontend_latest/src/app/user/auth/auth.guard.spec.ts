import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalizeRouterModule, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { AuthGuard } from './auth.guard';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsService } from '@app/services/notifications.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userStateService: UserStateService;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [
        AuthGuard,
        UserService,
        LocalizeRouterService,
        UserStateService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    });

    guard = TestBed.inject(AuthGuard);
    userStateService = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should determines whether route can be activated', async () => {
    const fakeUrl = '/';
    guard.canActivate(dummyRoute, fakeRouterState(fakeUrl));
  });

  it('should checks login for specified url and redirects user', async () => {
    jest.spyOn(userStateService, 'getCurrentUser').mockReturnValue(of());
    guard.checkLogin('https://dev.dane.gov.pl/pl/user/dashboard/desktop').subscribe(value => {
      expect(value).toBeTruthy();
    });
  });
});

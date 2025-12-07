import { importProvidersFrom, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { NewsletterService } from '@app/services/newsletter.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';

describe('ActiveNewsletterComponent', () => {
  let component: ActiveNewsletterComponent;
  let fixture: ComponentFixture<ActiveNewsletterComponent>;
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        ActiveNewsletterComponent
      ],
      providers: [
        importProvidersFrom(AppTestingModule),
        NewsletterService,
        NotificationsService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ token: '1dfg6458dgd3' }) } },
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NewsletterService);
    fixture = TestBed.createComponent(ActiveNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should add success message', () => {
    jest.spyOn(service, 'confirmNewsletterSubscription').mockReturnValue(
      of({ data: { attributes: { newsletter_subscription_info: 'treść testowa' } } }),
    );
    component.ngOnInit();
    expect(component.successMessage).toEqual('treść testowa');
  });

  it('should unsubscribe when component is destroyed', async () => {
    component['subscription'] = of().subscribe();
    const unsubscriptionSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalled();
  });
});

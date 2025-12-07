import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { NewsletterService } from '@app/services/newsletter.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';
import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('NewsletterComponent', () => {
  let component: NewsletterComponent;
  let fixture: ComponentFixture<NewsletterComponent>;
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        SharedModule,
        NewsletterComponent
      ],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        FormBuilder,
        NotificationsService,
        NewsletterService,
        importProvidersFrom(AppTestingModule)
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NewsletterService);
    fixture = TestBed.createComponent(NewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create a form with 3 controls and all should be required', () => {
    jest.spyOn(service, 'getNewsletterRegulations').mockReturnValue(
      of({ data: { attributes: { newsletter_subscription_info: 'treść testowa' } } }),
    );
    component.ngOnInit();
    expect(component.newsletterForm.get('email').setValue('')).toBeFalsy();
    expect(component.newsletterForm.get('personal_data_processing').setValue('')).toBeFalsy();
    expect(component.newsletterForm.get('personal_data_use').setValue('')).toBeFalsy();
  });

  it('should determines whether all consents are checked or unchecked', () => {
    component.onChangeAll(true);
    expect(component.allChecked).toEqual(true);
  });

  it('should determines whether single consent is checked or unchecked', () => {
    component.onChange('personal_data_use', false);
    expect(component.allChecked).toEqual(false);
  });

  it('should fill required fields and the form should be valid', () => {
    jest.spyOn(service, 'addNewsletterSubscription').mockReturnValue(
      of({ data: { attributes: { newsletter_subscription_info: 'treść testowa' } } }),
    );
    component.newsletterForm.setValue({
      email: 'user@example.com',
      personal_data_processing: true,
      personal_data_use: true,
    });
    component.newsletterForm.updateValueAndValidity();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.successMessage).toEqual('treść testowa');
    expect(component.newsletterForm.valid).toBeTruthy();
  });
});

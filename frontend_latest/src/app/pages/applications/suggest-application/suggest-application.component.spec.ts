import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { SuggestApplicationComponent } from './suggest-application.component';

import { AppTestingModule } from '@app/app.testing.module';
import { ApiResponse } from '@app/services/api';
import { ApplicationsService } from '@app/services/applications.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TextToLinksPipe } from '@app/shared/pipes/text-to-links.pipe';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

const requiredFieldsDataWithoutCaptcha = {
  title: 'Lorem ipsum dolor sit amet as title',
  url: 'http://example.com',
  notes: 'Lorem ipsum dolor sit amet as notes',
  author: 'Author Name',
  applicant_email: 'author@example.com',
  is_personal_data_processing_accepted: true,
  is_terms_of_service_accepted: true,
};

describe('SuggestApplicationComponent', () => {
  let component: SuggestApplicationComponent;
  let fixture: ComponentFixture<SuggestApplicationComponent>;
  let service: ApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        SuggestApplicationComponent,
        MathCaptchaComponent,
        NotificationsComponent,
        NotificationsServerComponent,
        SanitizeHtmlPipe,
        TextToLinksPipe,
        ImageUploadComponent,
      ],
      providers: [
        ApplicationsService,
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    });

    service = TestBed.inject(ApplicationsService);
    fixture = TestBed.createComponent(SuggestApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 8 required controls', () => {
    expect(component.applicationForm.get('title').setValue('')).toBeFalsy();
    expect(component.applicationForm.get('url').setValue('')).toBeFalsy();
    expect(component.applicationForm.get('notes').setValue('')).toBeFalsy();
    expect(component.applicationForm.get('author').setValue('')).toBeFalsy();
    expect(component.applicationForm.get('applicant_email').setValue('')).toBeFalsy();
    expect(component.applicationForm.get('is_personal_data_processing_accepted').setValue(false)).toBeFalsy();
    expect(component.applicationForm.get('is_terms_of_service_accepted').setValue(false)).toBeFalsy();
    expect(component.applicationForm.get('captcha').setValue('')).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    const spy = jest.spyOn(service, 'suggest').mockImplementation(() => EMPTY);
    component.onApplicationFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isSuggestionSent).toBeFalsy();
  });

  it('should appends new, empty dataset row (input + remove button)', () => {
    component.onAppendDatasetRow();
    expect(component.applicationForm.get('dataset')).toBeNull();
  });

  it('should appends new, empty external dataset row (input + input + remove button)', () => {
    component.onAppendExternalDatasetRow();
    expect(component.applicationForm.get('external_datasets')).not.toBeNull();
  });

  it('should removes selected dataset row', () => {
    component.onRemoveDatasetRow(1);
    expect(component.applicationForm.get('dataset')).toBeNull();
  });

  it('should removes selected external dataset row', () => {
    component.onRemoveExternalDatasetRow(1);
    expect(component.applicationForm.get('external_datasets')).not.toBeNull();
  });

  it('should sets image data on every temp image upload or remove', () => {
    component.onFileChange('image', 'test');
    expect(component.applicationForm.get('image')).not.toBeNull();
  });

  it('should show sections in view depends on category type: mobileType', () => {
    component.selectedCategoryChange('mobileType');
    expect(component.selectedMobileType).toBeTruthy();
    expect(component.selectedDesktopType).toBeFalsy();
  });

  it('should show sections in view depends on category type: desktopType', () => {
    component.selectedCategoryChange('desktopType');
    expect(component.selectedDesktopType).toBeTruthy();
    expect(component.selectedMobileType).toBeFalsy();
  });

  it('should check if item form autocompleted list is selected, if not set invalid error', () => {
    const event = {
      target: {
        attributes: {
          readonly: true,
        },
      },
    };
    component.onCheckIfItemIsSelected(event, 1);
    expect(component.applicationForm.get('dataset')).toBeNull();
  });

  describe('Submit form (save suggestion)', () => {
    let equationSum: number;

    beforeEach(() => {
      const select = fixture.debugElement.query(By.css('.form-select')).nativeElement;
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      const captchaDe = fixture.debugElement.query(By.css('.captcha'));
      const equation = (captchaDe.nativeElement as HTMLDivElement).querySelector('.captcha__equation').textContent;
      const equationArr = equation.replace(/ /g, '').replace('=', '').split('+');
      equationSum = equationArr.map(item => +item).reduce((acc, item) => acc + item);
    });

    it('should fill required fields and the form should be valid', () => {
      component.applicationForm.patchValue({
        ...requiredFieldsDataWithoutCaptcha,
        captcha: equationSum,
      });
      expect(component.applicationForm.valid).toBeTruthy();
    });

    it('should save suggestion (call the service) when the form is valid', () => {
      const spy = jest.spyOn(service, 'suggest').mockReturnValue(of({} as ApiResponse));

      component.applicationForm.patchValue({
        ...requiredFieldsDataWithoutCaptcha,
        captcha: equationSum,
      });

      component.onApplicationFormSubmit();
      console.log(spy);
      expect(spy).toHaveBeenCalled();
      expect(component.isSuggestionSent).toBeTruthy();
    });
  });
});

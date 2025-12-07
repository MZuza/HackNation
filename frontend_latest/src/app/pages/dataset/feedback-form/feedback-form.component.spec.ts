import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { FeedbackFormComponent } from '@app/pages/dataset/feedback-form/feedback-form.component';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';

describe('FeedbackFormComponent', () => {
  let component: FeedbackFormComponent;
  let fixture: ComponentFixture<FeedbackFormComponent>;
  let service: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FeedbackFormComponent,
        MathCaptchaComponent
      ],
      providers: [
        { provide: DatasetService, useClass: DatasetService },
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    });

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(FeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 2 controls', () => {
    expect(component.feedbackForm.contains('feedback')).toBeTruthy();
    expect(component.feedbackForm.contains('captcha')).toBeTruthy();
  });

  it('should make the feedback control required and have at least min length', () => {
    const control = component.feedbackForm.get('feedback');
    control.patchValue('ab');
    expect(control.valid).toBeFalsy();
    expect(control.value.length).toBeLessThan(component.minFeedbackLength);
  });

  it('should make the captcha control required', () => {
    const control = component.feedbackForm.get('captcha');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    const spy = jest.spyOn(service, 'sendDatasetFeedback').mockImplementation(() => EMPTY);
    component.onFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isFeedbackSent).toBeFalsy();
  });

  describe('submit form (save feedback)', () => {
    let equationSum: number;

    beforeEach(() => {
      const captchaDe = fixture.debugElement.query(By.css('.captcha'));
      const equation = (captchaDe.nativeElement as HTMLDivElement).querySelector('.captcha__equation').textContent;
      const equationArr = equation.replace(/ /g, '').replace('=', '').split('+');
      equationSum = equationArr.map(item => +item).reduce((acc, item) => acc + item);
    });

    it('should fill required fields and the form should be valid', () => {
      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback',
        captcha: equationSum,
      });
      expect(component.feedbackForm.valid).toBeTruthy();
    });

    it('should save dataset feedback (call the service) when the form is valid', () => {
      const spy = jest.spyOn(service, 'sendDatasetFeedback').mockImplementation(() => of(true));

      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback - dataset',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });

    it('should save resource feedback (call the service) when the form is valid', () => {
      const spy = jest.spyOn(service, 'sendResourceFeedback').mockImplementation(() => of(true));

      component.model = ApiModel.RESOURCE;
      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });
  });
});

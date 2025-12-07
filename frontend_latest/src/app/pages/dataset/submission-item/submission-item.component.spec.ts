import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { SubmissionItemComponent } from '@app/pages/dataset/submission-item/submission-item.component';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';

const params = {
  data: {
    post: {
      data: {
        attributes: {
          title: 'Lorem ipsum title',
          notes: 'Lorem ipsum notes',
        },
      },
    },
  },
};

class SeoServiceStub {
  setPageTitle() {}
  setDescriptionFromText() {}
}

describe('SubmissionItemComponent', () => {
  let component: SubmissionItemComponent;
  let fixture: ComponentFixture<SubmissionItemComponent>;
  let service: DatasetService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        SubmissionItemComponent,
        MathCaptchaComponent,
        NotificationsComponent,
        NotificationsServerComponent
      ],
      providers: [
        importProvidersFrom(AppTestingModule),
        DatasetService,
        { provide: ActivatedRoute, useValue: {snapshot: params }},
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsService
      ],
    });

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(SubmissionItemComponent);
    route = TestBed.inject(ActivatedRoute);
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
    const spy = jest.spyOn(service, 'sendSubmissionFeedback').mockImplementation(() => EMPTY);
    component.onFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isFeedbackSent).toBeFalsy();
  });

  describe('submit form (save submission)', () => {
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

    it('should save submission (call the service) when the form is valid', () => {
      const spy = jest.spyOn(service, 'sendSubmissionFeedback').mockImplementation(() => of(true));

      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as submission',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });
  });
});

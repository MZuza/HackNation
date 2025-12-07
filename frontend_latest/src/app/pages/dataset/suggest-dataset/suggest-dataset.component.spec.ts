import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { SuggestDatasetComponent } from '@app/pages/dataset/suggest-dataset/suggest-dataset.component';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';

describe('SuggestDatasetComponent', () => {
  let component: SuggestDatasetComponent;
  let fixture: ComponentFixture<SuggestDatasetComponent>;
  let service: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        SuggestDatasetComponent,
        MathCaptchaComponent,
        NotificationsComponent,
        NotificationsServerComponent
      ],
      providers: [
        { provide: DatasetService, useClass: DatasetService },
        NotificationsService,
        SeoService,
        importProvidersFrom(AppTestingModule)
      ],
    });

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(SuggestDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 6 controls', () => {
    expect(component.datasetForm.contains('title')).toBeTruthy();
    expect(component.datasetForm.contains('notes')).toBeTruthy();
    expect(component.datasetForm.contains('organization_name')).toBeTruthy();
    expect(component.datasetForm.contains('data_link')).toBeTruthy();
    expect(component.datasetForm.contains('potential_possibilities')).toBeTruthy();
    expect(component.datasetForm.contains('captcha')).toBeTruthy();
  });

  it('should have required fields', () => {
    const titleControl = component.datasetForm.get('title');
    const notesControl = component.datasetForm.get('notes');
    const captchaControl = component.datasetForm.get('captcha');

    titleControl.setValue('');
    notesControl.setValue('');
    captchaControl.setValue('');

    expect(titleControl.valid).toBeFalsy();
    expect(notesControl.valid).toBeFalsy();
    expect(captchaControl.valid).toBeFalsy();
  });

  it('should NOT submit (call the service) when the form is invalid', () => {
    const spy = jest.spyOn(service, 'sendSubmission').mockImplementation(() => EMPTY);
    component.onDatasetFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isSuggestionSent).toBeFalsy();
  });

  describe('submit form', () => {
    let equationSum: number;

    beforeEach(() => {
      const captchaDe = fixture.debugElement.query(By.css('.captcha'));
      const equation = (captchaDe.nativeElement as HTMLDivElement).querySelector('.captcha__equation').textContent;
      const equationArr = equation.replace(/ /g, '').replace('=', '').split('+');
      equationSum = equationArr.map(item => +item).reduce((acc, item) => acc + item);
    });

    it('should fill required fields and the form should be valid', () => {
      component.datasetForm.patchValue({
        title: 'Lorem ipsum dolor sit amet as title',
        notes: 'Pariatur nam libero qui rem perferendis impedit dolor mollitia iure ex illum! as notes',
        captcha: equationSum,
      });
      expect(component.datasetForm.valid).toBeTruthy();
    });

    it('should save submission (call the service) when the form is valid', () => {
      const spy = jest.spyOn(service, 'sendSubmission').mockImplementation(() => of(true));

      component.datasetForm.patchValue({
        title: 'Lorem ipsum dolor sit amet as title',
        notes: 'Pariatur nam libero qui rem perferendis impedit dolor mollitia iure ex illum! as notes',
        captcha: equationSum,
      });

      component.onDatasetFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isSuggestionSent).toBeTruthy();
    });
  });
});

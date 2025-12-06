import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsFormQuestionComponent } from '@app/shared/cms/cms-forms/cms-form-question/cms-form-question.component';

describe('CmsFormQuestionComponent', () => {
  let component: CmsFormQuestionComponent;
  let fixture: ComponentFixture<CmsFormQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CmsFormQuestionComponent
      ],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsFormQuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});

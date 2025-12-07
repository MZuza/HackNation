import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsService } from '@app/services/cms.service';
import { ICmsForm } from '@app/services/models/cms/forms/cms-form';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { CmsFormComponent } from '@app/shared/cms/cms-forms/cms-form/cms-form.component';
import { SharedModule } from '@app/shared/shared.module';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
  setPageTitle() {}
}

const formPage: ICmsForm = {
  id: 1,
  meta: {
    detail_url: '',
    first_published_at: new Date(),
    html_url: '',
    url_path: '',
    parent: '',
    search_description: '',
    seo_title: '',
    show_in_menus: false,
    slug: '',
    type: '',
  },
  title: 'test',
  last_published_at: '',
  latest_revision_created_at: '',
  intro: '',
  thank_you_text: '',
  formsets: [{ title: '', name: '', description: '', required: false, default_value: '', fields: [] }],
  formsetObjects: [],
};

describe('CmsFormComponent', () => {
  let component: CmsFormComponent;
  let fixture: ComponentFixture<CmsFormComponent>;
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        SharedModule,
        CmsFormComponent
      ],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsService,
        CmsService,
        importProvidersFrom(AppTestingModule)
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(CmsFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.cmsFormPage = formPage;
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should submit', () => {
    component.cmsFormPage = formPage;
    component.form = new FormGroup({
      comment: new FormControl(null),
    });
    fixture.detectChanges();
    component.onSubmit();
    expect(component.submitError).toBeFalsy();
  });
});

import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { PreviewCmsComponent } from '@app/pages/preview-cms/preview-cms.component';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';

const ActivatedRouteStub = {
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
    queryParams: {
      q: 'test',
    },
};

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('PreviewCmsComponent', () => {
  let component: PreviewCmsComponent;
  let fixture: ComponentFixture<PreviewCmsComponent>;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, PreviewCmsComponent],
      providers: [
        importProvidersFrom(AppTestingModule),
        { provide: ActivatedRoute, useValue: {snapshot: ActivatedRouteStub} },
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsService, ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PreviewCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get slug and query params from route. Display content only for admin', () => {
    component.ngOnInit();
    expect(component.queryParams).toEqual({ q: 'test' });
  });
});

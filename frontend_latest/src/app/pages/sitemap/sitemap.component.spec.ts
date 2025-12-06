import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppTestingModule } from '@app/app.testing.module';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';

class BsModalServiceStub {}

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        SitemapComponent
      ],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub},
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });
});

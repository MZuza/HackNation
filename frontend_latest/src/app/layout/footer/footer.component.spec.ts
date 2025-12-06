import { EventEmitter, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FooterComponent } from './footer.component';

import { AppTestingModule } from '@app/app.testing.module';
import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { CmsService } from '@app/services/cms.service';
import { SharedModule } from '@app/shared/shared.module';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let service: CmsService;
  const BsModalServiceMock = {
    onHidden: new EventEmitter(),
    hide: () => {},
    open: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, FooterComponent],
      providers: [
        { provide: BsModalService, useValue: BsModalServiceMock },
        CmsService,
        FooterLogosFilterService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', async () => {
    expect(component).toBeDefined();
  });
});

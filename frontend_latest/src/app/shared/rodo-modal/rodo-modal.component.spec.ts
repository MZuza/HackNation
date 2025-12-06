import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsService } from '@app/services/cms.service';
import { RodoModalComponent } from '@app/shared/rodo-modal/rodo-modal.component';

describe('RodoModalComponent', () => {
  let component: RodoModalComponent;
  let fixture: ComponentFixture<RodoModalComponent>;
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        RodoModalComponent
      ],
      providers: [
        CmsService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(RodoModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create modal', () => {
    const spyFunction = jest.spyOn(service, 'getSimplePage').mockReturnValue(
      of({
        id: 1,
        meta: {},
        title: 'test',
        url_path: '',
        last_published_at: '',
        latest_revision_created_at: '',
        background_image: '',
        background_color: '',
        background_paralax: false,
        body: {
          blocks: [],
        },
      }),
    );
    component.ngOnInit();
    expect(spyFunction).toHaveBeenCalled();
    expect(component.pageTitle).toEqual('test');
  });

  it('should close modal', () => {
    jest.spyOn(component.isModalClosed, 'emit');
    component.closeModal();
    expect(component.isModalClosed.emit).toHaveBeenCalled();
  });
});

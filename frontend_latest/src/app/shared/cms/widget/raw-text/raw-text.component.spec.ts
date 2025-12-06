import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { EmbedRawTextService } from '@app/services/embed-raw-text.service';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { RawTextComponent } from '@app/shared/cms/widget/raw-text/raw-text.component';

const iWidget: IWidget = {
  general: {
    margin: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    padding: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    foregroundColor: { r: 0, g: 0, b: 0, a: 0 },
    style: '',
    textAlignment: '',
    classes: '',
  },
  type: WidgetType.BANNER,
  id: '1',
};

describe('RawTextComponent', () => {
  let component: RawTextComponent;
  let fixture: ComponentFixture<RawTextComponent>;
  let service: EmbedRawTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RawTextComponent],
      providers: [EmbedRawTextService, importProvidersFrom(AppTestingModule)],
    }).compileComponents();

    service = TestBed.inject(EmbedRawTextService);
    fixture = TestBed.createComponent(RawTextComponent);
    component = fixture.componentInstance;
    component.rawText = {
      ...iWidget,
      value: 'value',
      settings: { text: '' },
    };
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should prepare text with styles do display in html', () => {
    jest.spyOn(component.rawTextHasLoaded, 'emit');
    component.ngOnInit();
    expect(component.rawTextHasLoaded.emit).toHaveBeenCalled();
  });

  it('should set isFooterNav to false', () => {
    component.IsListFooterNav('page-footer');
    expect(component.isFooterNav).toBeFalsy();
  });

  it('should set isFooterNav to false', () => {
    component.IsListFooterNav('page-footer__nav-title');
    expect(component.isFooterNav).toBeTruthy();
  });
});

import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { CmsBlockComponent } from '@app/shared/cms/cms-block/cms-block.component';
import { SharedModule } from '@app/shared/shared.module';

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

describe('SurveyComponent', () => {
  let component: CmsBlockComponent;
  let fixture: ComponentFixture<CmsBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CmsBlockComponent],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CmsBlockComponent);
    component = fixture.componentInstance;
    component.oneWidget = iWidget;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should subscribe to widgetsSubject', async () => {
    component.widgetsSubject = new BehaviorSubject<IWidget[]>([iWidget]);
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.widgets).toEqual([iWidget]);
  });
});

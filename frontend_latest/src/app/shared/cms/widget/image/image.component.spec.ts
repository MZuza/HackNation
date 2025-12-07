import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsService } from '@app/services/cms.service';
import { IBanner } from '@app/services/models/cms/widgets/banner';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { ImageComponent } from '@app/shared/cms/widget/image/image.component';

const iBanner: IBanner = {
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
  value: {
    image: 1,
    action_url: '',
    alt: '',
    format: '',
    target: '',
  },
};

const banner = {
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
  settings: {
    image: {
      alt: 'test',
      id: 1,
      title: 'test',
      url: 'test',
    },
  },
  value: {
    image: 1,
    action_url: 'url',
    alt: '',
    format: '',
    target: '_blank',
    title: 'test',
  },
};

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ImageComponent],
      providers: [
        CmsService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    component.banner = iBanner;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should display image from hyper editor', async () => {
    component.banner = banner;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.banner).toEqual(banner);
    expect(component.cssClass).toEqual(`cmsImage--neutral`);
  });

  it('should display image from hyper editor with textAlignment', async () => {
    const nexBanner = {
      ...banner,
      general: {
        textAlignment: 'center',
      },
    };
    component.banner = nexBanner;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.banner).toEqual(nexBanner);
    expect(component.cssClass).toEqual(`cmsImage--center`);
  });

  it('should display image from widget when format is defined and isFooterLogos is true', async () => {
    const nexBanner: IBanner = {
      ...iBanner,
      value: {
        ...iBanner.value,
        format: 'center',
      },
    };
    component.banner = nexBanner;
    component.isFooterLogos = true;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.banner).toEqual(nexBanner);
    expect(component.isFooterLogos).toEqual(true);
  });

  it('should display image from widget when type is IMAGE and isFooterLogos is not defined', async () => {
    const nexBanner = {
      ...iBanner,
      type: WidgetType.IMAGE,
      value: { download_url: '', format: 'center' },
    };
    component.banner = nexBanner;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.urlImage).toEqual(nexBanner.value.download_url);
    expect(component.cssClass).toEqual(`cmsImage--center`);
  });
});

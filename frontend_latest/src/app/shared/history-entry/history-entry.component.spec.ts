import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateDateFormatPipe } from '../pipes/translate-date-format.pipe';

import { AppTestingModule } from '@app/app.testing.module';
import { HistoryEntryComponent } from '@app/shared/history-entry/history-entry.component';
import { TimespanPipe } from '@app/shared/pipes/timespan.pipe';

describe('HistoryEntryComponent', () => {
  let component: HistoryEntryComponent;
  let fixture: ComponentFixture<HistoryEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HistoryEntryComponent, TranslateDateFormatPipe, TimespanPipe],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryEntryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should translate action and table name, format variables according to entry data and pass them to template for resource', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const data = {
        attributes: {
          new_value: {
            slug: 'test',
            title: 'test',
            dataset_id: 1,
          },
          table_name: 'resource',
          row_id: 1,
        },
      };
      translateService.currentLang = 'pl';
      component.item = data;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.title).toEqual('test');
      expect(component.link).toEqual('pl/dataset/1/resource/1');
    },
  ));

  it('should translate action and table name, format variables according to entry data and pass them to template for organization', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const data = {
        attributes: {
          new_value: {
            slug: 'test',
            title: 'test',
            dataset_id: 1,
          },
          table_name: 'organization',
          row_id: 1,
        },
      };
      translateService.currentLang = 'pl';
      component.item = data;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.title).toEqual('test');
      expect(component.link).toEqual('pl/institution/1,test');
    },
  ));

  it('should translate action and table name, format variables according to entry data and pass them to template for application_dataset',
    inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const data = {
        attributes: {
          new_value: {
            slug: 'test',
            title: 'test',
            dataset_id: 1,
            application_id: 1,
          },
          table_name: 'application_dataset',
          row_id: 1,
        },
      };
      translateService.currentLang = 'pl';
      component.item = data;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.title).toEqual('test');
      expect(component.link).toEqual('pl/application/1?dataset=1');
    },
  ));

  it('should translate action and table name, format variables according to entry data and pass them to template for user', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const data = {
        attributes: {
          new_value: {
            slug: 'test',
            title: 'test',
            email: 'test',
          },
          table_name: 'user',
          row_id: 1,
        },
      };
      translateService.currentLang = 'pl';
      component.item = data;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.title).toEqual('test');
      expect(component.link).toEqual('pl');
    },
  ));

  it('should translate action and table name, format variables according to entry data and pass them to template for default', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const data = {
        attributes: {
          new_value: {
            slug: 'test',
            title: 'test',
            dataset_id: 1,
            email: 'test',
          },
          table_name: 'resources',
          row_id: 1,
        },
      };
      translateService.currentLang = 'pl';
      component.item = data;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.title).toEqual('test');
      expect(component.link).toEqual('pl/resources/1,test');
    },
  ));
});

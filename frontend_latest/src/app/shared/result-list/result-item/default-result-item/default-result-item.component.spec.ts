import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { MapParamsToTranslationKeysService } from '@app/services/map-params-to-translation-keys.service';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';

describe('DefaultResultItemComponent ', () => {
  let component: DefaultResultItemComponent;
  let fixture: ComponentFixture<DefaultResultItemComponent>;
  let service: MapParamsToTranslationKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        DefaultResultItemComponent
      ],
      providers: [
        MapParamsToTranslationKeysService,
        importProvidersFrom(AppTestingModule)
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(MapParamsToTranslationKeysService);
    fixture = TestBed.createComponent(DefaultResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set appliedFiltersNames based on params', () => {
    component.queryParams = {
      'category[id][terms]': 'Attribute.CategoryLong',
      'institution[id][terms]': 'Attribute.InstitutionLong',
      'format[terms]': 'Attribute.FormatLong',
      'openness_score[terms]': 'Attribute.OpennessScore',
    };
    component.ngOnInit();
    expect(component.appliedFiltersNames).toEqual([
      'Attribute.CategoryLong',
      'Attribute.InstitutionLong',
      'Attribute.FormatLong',
      'Attribute.OpennessScore',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';

describe('DetailsResultItemComponent', () => {
  let component: DetailsResultItemComponent;
  let fixture: ComponentFixture<DetailsResultItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DetailsResultItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsResultItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set categoryIcon to ic-aplikacje when showcaseCategoryKey is app', () => {
    component.showcaseCategoryKey = 'app';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-aplikacje');
  });

  it('should set categoryIcon to ic-portal-www when showcaseCategoryKey is www', () => {
    component.showcaseCategoryKey = 'www';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-portal-www');
  });

  it('should set categoryIcon to ic-inne when showcaseCategoryKey is other', () => {
    component.showcaseCategoryKey = 'other';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-inne');
  });

  it('should set iconName to dataset when titleTranslationKey is Datasets.Single', () => {
    component.titleTranslationKey = 'Datasets.Single';
    component.ngOnInit();
    expect(component.iconName).toEqual('dataset');
  });

  it('should set iconName to resource when titleTranslationKey is Resources.Single', () => {
    component.titleTranslationKey = 'Resources.Single';
    component.ngOnInit();
    expect(component.iconName).toEqual('resource');
  });
});

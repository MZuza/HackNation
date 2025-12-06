import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { RegionsSearchComponent } from './regions-search.component';

import { AppTestingModule } from '@app/app.testing.module';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { SeoService } from '@app/services/seo.service';
import { ServicesModule } from '@app/services/services.module';
import { SearchSuggestRegionListboxOption } from '@app/shared/search-suggest/search-suggest';
import { SharedModule } from '@app/shared/shared.module';

class SeoServiceStub {
  setPageTitle() {}
}

class LocalizeRouterServiceStub {}

describe('RegionsSearchComponent', () => {
  let component: RegionsSearchComponent;
  let fixture: ComponentFixture<RegionsSearchComponent>;
  let service: ListViewFiltersService;
  let seoService: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, ServicesModule, RegionsSearchComponent],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        {provide: LocalizeRouterService, useClass: LocalizeRouterServiceStub},
        ListViewFiltersService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(ListViewFiltersService);
    seoService = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(RegionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should call getAllFilters function with listboxOption object', async () => {
    const listboxOption: SearchSuggestRegionListboxOption = {
      bbox: [],
      hierarchy_label: 'Polska',
      region_id: 88543,
      title: 'Polska',
      areaTranslationKey: 'Polska',
    };
    component.getAllFilters(listboxOption);
    expect(component.noResults).toEqual(false);
    expect(component.regionId).toEqual(listboxOption.region_id);
  });

  it('should call getAllFilters function with null listboxOption object', async () => {
    const listboxOption: SearchSuggestRegionListboxOption = null;
    component.getAllFilters(listboxOption);
    expect(component.noResults).toEqual(true);
    expect(component.regionId).toEqual(undefined);
  });
});

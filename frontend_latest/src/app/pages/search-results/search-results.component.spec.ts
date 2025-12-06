import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { SearchResultsComponent } from './search-results.component';

import { AppTestingModule } from '@app/app.testing.module';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let service: ListViewDetailsService;
  let seoService: SeoService;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        SharedModule,
        SearchResultsComponent
      ],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        ListViewDetailsService,
        SearchService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(ListViewDetailsService);
    searchService = TestBed.inject(SearchService);
    seoService = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should set counter and results', async () => {
    jest.spyOn(searchService, 'search').mockReturnValue(
      of({
        meta: {
          count: 3,
          aggregations: {
            counters: {},
          },
        },
        data: [],
        links: {
          self: '',
        },
      }),
    );
    component.ngOnInit();
    expect(component.totalCount).toEqual(3);
    expect(component.counters).toStrictEqual({});
  });

  it('should updates query params on user interaction', async () => {
    const params = { page: 1, per_page: 5, q: '', sort: 'relevance' };
    component.updateParams(params);
    expect(component.basicParams).toEqual({ sort: 'relevance', page: 1, q: '', per_page: 5 });
  });

  it('should updates query params on user interaction without page', async () => {
    const params = { per_page: 5, q: '', sort: 'relevance' };
    component.updateParams(params);
    expect(component.basicParams).toEqual({ sort: 'relevance', page: 1, q: '', per_page: 5 });
  });
});

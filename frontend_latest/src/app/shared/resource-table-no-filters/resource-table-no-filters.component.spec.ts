import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ResourceTableNoFiltersComponent } from '@app/shared/resource-table-no-filters/resource-table-no-filters.component';

describe('ResourceTableNoFiltersComponent', () => {
  let component: ResourceTableNoFiltersComponent;
  let fixture: ComponentFixture<ResourceTableNoFiltersComponent>;
  let service: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        ResourceTableNoFiltersComponent
      ],
      providers: [
        importProvidersFrom(AppTestingModule),
        DatasetService,
        NotificationsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                post: {
                  attributes: {
                    title: 'testowy tytuł',
                  },
                },
              },
              params: { resourceId: '1' },
            },
            queryParamMap: of({ page: 1, per_page: 5, q: '', sort: 'relevance' }),
          },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(ResourceTableNoFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create if resourceId is not null', () => {
    component.resourceId = '1';
    component.ngOnInit();
    expect(component.resourceId).not.toBeNull();
  });

  it('should create if resourceId is null', () => {
    component.ngOnInit();
    expect(component.resourceId).not.toBeNull();
  });

  it('should sorts data by specified column', () => {
    const sortName = 'relevance';
    component.params = { page: 1, per_page: 5, q: '', sort: 'relevance' };
    component.sortByColumn(sortName);
    expect(component.params).not.toBeNull();
  });

  it('should view mouse leave event, clears focus', () => {
    component.focusedCell = null;
    component.onMouseLeave();
    expect(component.hoveredRowIndex).toEqual(-1);
  });

  it('should movement inside tbody via keyboards arrows', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);
    component.onKeyDown(event);
    expect(component.hoveredRowIndex).toEqual(-1);
  });

  it('should sets cell focus using mouse', () => {
    const rowIndex = 1;
    const cellIndex = 1;
    component.onFocus(rowIndex, cellIndex);
    expect(component.hoveredRowIndex).toEqual(1);
    expect(component.focusedCell).toEqual(1);
  });
});

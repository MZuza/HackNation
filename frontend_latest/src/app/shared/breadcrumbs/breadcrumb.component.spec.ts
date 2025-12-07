import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';

import { AppTestingModule } from '@app/app.testing.module';
import { BreadcrumbService } from '@app/shared/breadcrumbs/breadcrumb.service';
import { BreadcrumbsComponent } from '@app/shared/breadcrumbs/breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BreadcrumbsComponent],
      providers: [
        BreadcrumbService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    service = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should unsubscribe when component is destroyed', async () => {
    component['breadcrumbs$'] = of().subscribe();
    const unsubscriptionSpy = jest.spyOn(component['breadcrumbs$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalled();
  });
});

import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ShepherdService } from 'angular-shepherd';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsService } from '@app/services/notifications.service';
import { TourButtonComponent } from '@app/shared/tour/tour-button/tour-button.component';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';

describe('TourButtonComponent', () => {
  let component: TourButtonComponent;
  let fixture: ComponentFixture<TourButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), TourButtonComponent],
      providers: [
        TourDataService,
        TourService,
        NotificationsService,
        ShepherdService,
        importProvidersFrom(AppTestingModule)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TourButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should sets button visibility for current route', () => {
    component.ngOnInit();
    expect(component.isTooltipVisible).toEqual(true);
    expect(component.isButtonActive).toEqual(true);
  });

  it('should shows tour', () => {
    component.showTour();
  });
});

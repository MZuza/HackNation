import { CommonModule } from '@angular/common';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateParser, TranslateService } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';
import { DatepickerComponent } from '@app/shared/datepicker/datepicker.component';
import { McodMatDatepickerIntl } from '@app/shared/datepicker/McodMatDatepickerIntl';
import { SharedModule } from '@app/shared/shared.module';

describe('Datepicker component', () => {
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
              CommonModule,
              SharedModule,
              NoopAnimationsModule,
              TranslateModule.forRoot({
                  parser: {
                      provide: TranslateParser,
                      useClass: TranslateICUParser
                  },
                  defaultLanguage: 'pl',
                  useDefaultLang: true
              }),
              MatDatepickerModule,
              MatMomentDateModule,
              MatInputModule,
              ReactiveFormsModule,
              DatepickerComponent,
              DateRangePickerComponent,
            ],
            providers: [
                {
                    provide: MAT_DATE_FORMATS, useValue: {
                        ...MAT_MOMENT_DATE_FORMATS,
                        display: {...MAT_MOMENT_DATE_FORMATS.display, dateInput: 'YYYY-MM-DD'}
                    }
                },
                {provide: MatDatepickerIntl, useClass: McodMatDatepickerIntl},
            ]
        }).compileComponents();

        const injector = getTestBed();
        translateService = injector.inject(TranslateService);
        translateService.currentLang = 'pl';
    });

    it('should be created', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        fixture.detectChanges();
        const datepickerComponent = fixture.componentInstance;
        expect(datepickerComponent).toBeTruthy();
    });


    it('should render date provided by input', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        const datepickerComponent = fixture.componentInstance;
        const dateString = '2020-11-03';

        datepickerComponent.date = '2020-11-03';
        fixture.detectChanges();

        const renderedDate = fixture.nativeElement.querySelector('.datepicker__input').value;
        expect(renderedDate).toBe(dateString);
    });

    it('should disable only dates after max date', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        const datepickerComponent = fixture.componentInstance;

        datepickerComponent.date = '2020-11-03';
        datepickerComponent.maxDate = '2020-11-10';
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.btn')).triggerEventHandler('click', {});
        fixture.detectChanges();

        const calendar = fixture.debugElement.query(By.css('.mat-datepicker-content'));
        const disabledDays = calendar.queryAll(By.css('.mat-calendar-body-disabled .mat-calendar-body-cell-content'));

        expect(disabledDays.find(day => day.nativeElement.textContent.trim() === '11')).toBeTruthy();
        expect(disabledDays.find(day => day.nativeElement.textContent.trim() === '10')).toBeFalsy();
    });

    it('should disable only dates before min date', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        const datepickerComponent = fixture.componentInstance;

        datepickerComponent.date = '2020-11-03';
        datepickerComponent.minDate = '2020-11-10';
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.btn')).triggerEventHandler('click', {});
        fixture.detectChanges();

        const calendar = fixture.debugElement.query(By.css('.mat-datepicker-content'));
        const disabledDays = calendar.queryAll(By.css('.mat-calendar-body-disabled .mat-calendar-body-cell-content'));

        expect(disabledDays.find(day => day.nativeElement.textContent.trim() === '10')).toBeFalsy();
        expect(disabledDays.find(day => day.nativeElement.textContent.trim() === '9')).toBeTruthy();
    });

    it('should render disabled input', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        const datepickerComponent = fixture.componentInstance;

        datepickerComponent.isDisabled = true;
        fixture.detectChanges();

        const renderedDate = fixture.nativeElement.querySelector('.datepicker__input').disabled;
        expect(renderedDate).toBeTruthy();
    });


    it('should be no button when panel is disabled', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        const datepickerComponent = fixture.componentInstance;

        datepickerComponent.isPanelVisible = false;
        fixture.detectChanges();

        const openCalendarButton = fixture.debugElement.query(By.css('.btn'));
        expect(openCalendarButton).toBeFalsy();
    });


    it('should render proper button label for polish language', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        translateService.setTranslation('pl', {'Calendar.OpenCalendarLabel': 'Otwórz kalendarz'});
        translateService.setTranslation('en', {'Calendar.OpenCalendarLabel': 'Open calendar'});

        fixture.detectChanges();

        const openCalendarButton = fixture.debugElement.query(By.css('.btn'));

        expect(openCalendarButton.attributes['aria-label']).toEqual('Otwórz kalendarz');
    });

    it('should render proper button label for english language', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        translateService.currentLang = 'en';
        translateService.setTranslation('pl', {'Calendar.OpenCalendarLabel': 'Otwórz kalendarz'});
        translateService.setTranslation('en', {'Calendar.OpenCalendarLabel': 'Open calendar'});

        fixture.detectChanges();

        const openCalendarButton = fixture.debugElement.query(By.css('.btn'));

        expect(openCalendarButton.attributes['aria-label']).toEqual('Open calendar');
    });

    it('should render proper calendar popup button label for polish language', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        translateService.setTranslation('pl', {'Calendar.PrevMonthLabel': 'Poprzedni miesiąc'});
        translateService.setTranslation('en', {'Calendar.PrevMonthLabel': 'Previous month'});

        fixture.detectChanges();

        fixture.debugElement.query(By.css('.btn')).triggerEventHandler('click', {});
        fixture.detectChanges();

        const calendarPreviousButton = fixture.debugElement.query(By.css('.mat-calendar-previous-button'));

        expect(calendarPreviousButton.attributes['aria-label']).toEqual('Poprzedni miesiąc');
    });

    it('should render proper calendar popup button label for english language', () => {
        const fixture = TestBed.createComponent(DatepickerComponent);
        translateService.currentLang = 'en';
        translateService.setTranslation('pl', {'Calendar.PrevMonthLabel': 'Poprzedni miesiąc'});
        translateService.setTranslation('en', {'Calendar.PrevMonthLabel': 'Previous month'});

        fixture.detectChanges();

        fixture.debugElement.query(By.css('.btn')).triggerEventHandler('click', {});
        fixture.detectChanges();

        const calendarPreviousButton = fixture.debugElement.query(By.css('.mat-calendar-previous-button'));

        expect(calendarPreviousButton.attributes['aria-label']).toEqual('Previous month');
    });
});

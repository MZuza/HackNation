import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DateRangePickerComponent],
      providers: [
        importProvidersFrom(AppTestingModule),
        DateAdapter,
        provideNativeDateAdapter()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should check if start date input is exist', () => {
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(null);
    expect(component.datesChanged.next).not.toHaveBeenCalled();
  });

  it('should check if dates changed with is start date', () => {
    const date = new Date('2022-06-20');
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(date);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with no start date', () => {
    const date = new Date('2022-06-20');
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(date, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with null date and no start date', () => {
    component.endDate = new Date();
    fixture.detectChanges();
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(null, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with isStartDate is false and global startDate is not null', () => {
    component.startDate = new Date();
    fixture.detectChanges();
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(null, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed when global startDate is after end data', () => {
    const date = new Date('2022-06-20');
    component.startDate = new Date();
    fixture.detectChanges();
    jest.spyOn(component.datesChanged, 'next');
    component.onDateChange(date, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check sends apply filter change', () => {
    jest.spyOn(component.applyFilterChanged, 'emit');
    component.onApplyFilter();
    expect(component.applyFilterChanged.emit).toHaveBeenCalled();
  });
});

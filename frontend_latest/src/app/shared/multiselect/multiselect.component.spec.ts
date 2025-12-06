import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { MultiselectComponent } from '@app/shared/multiselect/multiselect.component';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, MultiselectComponent],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should event triggered on selecting item from dropdown, tempSelected is not empty', () => {
    const item = ['test'];
    component.multiselect = true;
    component.selectItem(item);
    expect(component.multiselect).toEqual(true);
    expect(component.tempSelected).not.toBeNull();
  });

  it('should opens up and closed dropdown. Clears search filter', () => {
    const item = ['test'];
    component.multiselect = true;
    component.tempSelected = item;
    component.isItemSelected(item);
    expect(component.multiselect).toEqual(true);
  });

  it('should filters out items by text', () => {
    component.options = ['Test', 'Test2'];
    component.displayValue = 'Test';
    component.performFilter('Test');
    expect(component.options).toEqual(['Test', 'Test2']);
  });

  it('should filters out items by text', () => {
    component.multiselect = true;
    component.tempSelected = ['item'];
    jest.spyOn(component.selectedChange, 'emit');
    component.applyFilters();
    expect(component.selected).toEqual([...component.tempSelected]);
    expect(component.selectedChange.emit).toHaveBeenCalled();
  });

  it('should filters out items by text when multiselect is false', () => {
    component.multiselect = false;
    component.tempSelected = ['item'];
    jest.spyOn(component.selectedChange, 'emit');
    component.applyFilters();
    expect(component.selected).toEqual(component.tempSelected);
    expect(component.selectedChange.emit).toHaveBeenCalled();
  });
});

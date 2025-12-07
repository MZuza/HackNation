import { importProvidersFrom, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { SingleselectComponent } from '@app/shared/singleselect/singleselect.component';

describe('SingleselectComponent', () => {
  let component: SingleselectComponent;
  let fixture: ComponentFixture<SingleselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, SingleselectComponent],
      providers: [importProvidersFrom(AppTestingModule)]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleselectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should on Input changes set displayed label based on whether item is selected or not', () => {
    component.options = ['opcja1', 'opcja2'];
    component.selected = 'opcja1';
    component.ngOnChanges({ selected: new SimpleChange(null, 'test', true) });
    expect(component.togglerLabel).toEqual('opcja1');
    expect(component.selectedIndex).toEqual(0);
    expect(component.currentIndex).toEqual(component.selectedIndex);
  });

  it('should on Input changes set displayed label based on whether item is selected or not - options is not set', () => {
    component.ngOnChanges({ selected: new SimpleChange(null, 'test', true) });
    expect(component.options).toEqual(undefined);
  });

  it('should click outside event handler', () => {
    const event = { target: { value: 'hello' } } as any;
    component.clickOutside(event);
    expect(component.isExpanded).toBeFalsy();
  });

  it('should click/select item event handler', () => {
    jest.spyOn(component.selectedChange, 'emit');
    component.selected = 'opcja1';
    component.selectItem('opcja2');
    expect(component.selected).toEqual('opcja2');
    expect(component.selectedChange.emit).toHaveBeenCalled();
  });

  it('should not click/select item event handler', () => {
    jest.spyOn(component.selectedChange, 'emit');
    component.selected = 'opcja1';
    component.selectItem('opcja1');
    expect(component.selected).toEqual('opcja1');
    expect(component.selectedChange.emit).not.toHaveBeenCalled();
  });

  it('should toggles dropdown', () => {
    component.toggleDropdown();
    expect(component.isExpanded).toBeTruthy();
    expect(component.currentIndex).toEqual(-1);
  });

  it('should sets next index on the list as active when options.length = -1', () => {
    component.options = [];
    component.setNextActiveSuggestionIndex();
    expect(component.currentIndex).toEqual(0);
  });

  it('should sets previous index on the list as active when notSelectedIndex = 0', () => {
    component.notSelectedIndex = 2;
    component.currentIndex = 0;
    component.setPreviousActiveSuggestionIndex();
    expect(component.currentIndex).toEqual(2);
  });

  it('should sets previous index on the list as active when currentIndex = 3', () => {
    component.notSelectedIndex = 2;
    component.currentIndex = 3;
    component.setPreviousActiveSuggestionIndex();
    expect(component.currentIndex).toEqual(2);
  });

  it('should movement inside tbody via keyboards arrows - key ArrowDown', () => {
    component.options = ['opcja1', 'opcja2'];
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const spyFunction = jest.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should movement inside tbody via keyboards arrows - key ArrowUp', () => {
    component.options = ['opcja1', 'opcja2'];
    component.notSelectedIndex = -1;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const spyFunction = jest.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should movement inside tbody via keyboards arrows - key Enter', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spyFunction = jest.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
    expect(component.isExpanded).toBeTruthy();
  });

  it('should movement inside tbody via keyboards arrows - key Tab', () => {
    component.isExpanded = true;
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(component.isExpanded).toBeFalsy();
  });

  it('should movement inside tbody via keyboards arrows - key Space', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space', shiftKey: true });
    const spyFunction = jest.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(spyFunction).toHaveBeenCalled();
    expect(component.isExpanded).toBeTruthy();
  });

  it('should movement inside tbody via keyboards arrows - key Escape', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    component.onKeydown(event);
    expect(component.isExpanded).toBeFalsy();
  });
});

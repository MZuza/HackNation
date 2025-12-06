import { Component, DebugElement, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { DatasetAutocompleteDirective } from '@app/shared/directives/dataset-autocomplete.directive';

@Component({
  template: `<input type="text" app-dataset-autocomplete />`,
})
class TestComponent {}

describe('DatasetAutocompleteDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElem: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        DatasetAutocompleteDirective,
        SearchService,
        NotificationsService,
        importProvidersFrom(AppTestingModule)
      ],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElem = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(inputElem).toBeTruthy();
  });

  it('should remove dropdown after document click', () => {
    const event = new Event('click');
    document.dispatchEvent(event);
    const drop = fixture.debugElement.queryAll(By.css('.dropdown-menu'));
    expect(drop).toStrictEqual([]);
  });

  it('should test', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    document.dispatchEvent(event);
    const drop = fixture.debugElement.queryAll(By.css('.dropdown-menu'));
    expect(drop).toStrictEqual([]);
  });
});

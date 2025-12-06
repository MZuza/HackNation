import { Component, DebugElement, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { FixedSidebarDirective } from '@app/shared/directives/fixed-sidebar.directive';

@Component({
  template: `<aside class="collapsible-sidebar-view__sidebar" id="sidebar" appFixedSidebar></aside>`,
})
class TestComponent {}

describe('FixedSidebarDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElem: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TranslateModule.forRoot(), FixedSidebarDirective],
      providers: [
        importProvidersFrom(AppTestingModule)
      ]
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElem = fixture.debugElement.query(By.css('#sidebar'));
  });

  it('should create', () => {
    expect(inputElem).toBeTruthy();
  });
});

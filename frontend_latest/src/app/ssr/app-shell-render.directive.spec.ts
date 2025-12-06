import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AppShellRenderDirective } from '@app/ssr/app-shell-render.directive';

@Component({
  template: `
    <div>
      <h1 *appShellRender class="header">Hello From server</h1>
    </div>
  `,
})
export class MockComponent {}

describe('App shell render directive', () => {
  describe('platform browser', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), AppShellRenderDirective],
        declarations: [MockComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      }).compileComponents();
    });

    it('should create component', () => {
      const fixture = TestBed.createComponent(MockComponent);
      const mockComponent = fixture.componentInstance;
      expect(mockComponent).toBeTruthy();
    });

    it('should render header', () => {
      const fixture = TestBed.createComponent(MockComponent);

      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.header'));

      expect(header).toBeFalsy();
    });
  });

  describe('platform server', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), AppShellRenderDirective],
        declarations: [MockComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      }).compileComponents();
    });

    it('should skip header rendering', () => {
      const fixture = TestBed.createComponent(MockComponent);

      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.header'));

      expect(header).toBeTruthy();
    });
  });
});

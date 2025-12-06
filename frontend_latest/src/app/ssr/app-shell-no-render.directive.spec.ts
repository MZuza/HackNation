import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AppShellNoRenderDirective } from '@app/ssr/app-shell-no-render.directive';

@Component({
  template: `
    <div>
      <h1 *appShellNoRender class="header">Hello From server</h1>
    </div>
  `,
  imports: [
    AppShellNoRenderDirective
  ],
  standalone: true
})
export class MockComponent {}

describe('App shell no render directive', () => {
  describe('platform browser', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), MockComponent, AppShellNoRenderDirective],
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

      expect(header).toBeTruthy();
    });
  });

  describe('platform server', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), MockComponent, AppShellNoRenderDirective],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      }).compileComponents();
    });

    it('should skip header rendering', () => {
      const fixture = TestBed.createComponent(MockComponent);

      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.header'));

      expect(header).toBeFalsy();
    });
  });
});

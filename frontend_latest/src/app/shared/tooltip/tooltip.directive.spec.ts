import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective as BsTooltip } from 'ngx-bootstrap/tooltip';
import { BehaviorSubject } from 'rxjs';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { FeatureFlagDirective } from '@app/shared/feature-flags/feature-flag.directive';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

class MockkFeatureFlagService {
  featureFlags = new BehaviorSubject([]);

  isFlagEnabled = true;

  validateFlag(...args): boolean {
    return this.isFlagEnabled;
  }

  setFlag(isEnabled: boolean) {
    this.isFlagEnabled = isEnabled;
  }
}

@Component({
  template: ` <h2 appTooltip="Text" [title]="'Title'">About</h2> `,
})
export class MockComponent {}

describe('Tooltip directive', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BsTooltip, TooltipDirective, FeatureFlagDirective],
      declarations: [MockComponent],
      providers: [{ provide: FeatureFlagService, useClass: MockkFeatureFlagService }, Overlay],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(MockComponent);
    const infoTooltipComponent = fixture.componentInstance;
    expect(infoTooltipComponent).toBeTruthy();
  });

  it('should render component with directive', () => {
    const fixture = TestBed.createComponent(MockComponent);

    fixture.detectChanges();

    const tooltips = fixture.debugElement.queryAll(By.directive(TooltipDirective));

    expect(tooltips.length).toBe(1);
  });

  it('should render tooltip with proper text', () => {
    const fixture = TestBed.createComponent(MockComponent);

    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(TooltipDirective));

    const directiveInstance = tooltip.injector.get(TooltipDirective);

    expect(directiveInstance.text).toBe('Text');
  });

  it('should render tooltip with proper title', () => {
    const fixture = TestBed.createComponent(MockComponent);

    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(TooltipDirective));

    const directiveInstance = tooltip.injector.get(TooltipDirective);

    expect(directiveInstance.title).toBe('Title');
  });
});

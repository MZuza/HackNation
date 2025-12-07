import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { BehaviorSubject } from 'rxjs';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { FeatureFlagDirective } from '@app/shared/feature-flags/feature-flag.directive';
import { InfoTooltipComponent } from '@app/shared/info-tooltip/info-tooltip.component';
import { SharedModule } from '@app/shared/shared.module';

class MockFeatureFlagService {
  featureFlags = new BehaviorSubject([]);

  isFlagEnabled = true;

  validateFlag(...args): boolean {
    return this.isFlagEnabled;
  }

  setFlag(isEnabled: boolean) {
    this.isFlagEnabled = isEnabled;
  }
}

describe('Info tooltip Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, InfoTooltipComponent, TooltipDirective, FeatureFlagDirective],
      providers: [{ provide: FeatureFlagService, useClass: MockFeatureFlagService }],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(InfoTooltipComponent);
    const infoTooltipComponent = fixture.componentInstance;
    expect(infoTooltipComponent).toBeTruthy();
  });

  it('should render proper tooltip', () => {
    const fixture = TestBed.createComponent(InfoTooltipComponent);
    const infoTooltipComponent = fixture.componentInstance;
    infoTooltipComponent.text = 'Asdf';

    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      const text = fixture.debugElement.query(By.css('.info-tooltip')).componentInstance.text;
      expect(text).toBe('Asdf');
    });
  });
});

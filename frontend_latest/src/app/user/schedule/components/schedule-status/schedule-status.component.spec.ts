import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScheduleStatusComponent } from '@app/user/schedule/components/schedule-status/schedule-status.component';

describe('Schedule Status Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleStatusComponent],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(ScheduleStatusComponent);
    const scheduleStatusComponent = fixture.componentInstance;
    expect(scheduleStatusComponent).toBeTruthy();
  });

  it('should render proper status when flag is set to true', () => {
    const fixture = TestBed.createComponent(ScheduleStatusComponent);
    const scheduleStatusComponent = fixture.componentInstance;
    scheduleStatusComponent.isCompleted = true;
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.css('span')).nativeElement.textContent.trim();
    const title = fixture.debugElement.query(By.css('title')).nativeElement.textContent.trim();
    expect(text).toBe('gotowy');
    expect(title).toBe('Zakończone sukcesem');
  });

  it('should render proper status when flag is set to false', () => {
    const fixture = TestBed.createComponent(ScheduleStatusComponent);
    fixture.detectChanges();

    const text = fixture.debugElement.query(By.css('span')).nativeElement.textContent.trim();
    const title = fixture.debugElement.query(By.css('title')).nativeElement.textContent.trim();
    expect(text).toBe('w przygotowaniu');
    expect(title).toBe('W przygotowaniu');
  });
});

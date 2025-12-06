import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { ScheduleSettingsService } from './schedule-settings.service';

describe('ScheduleSettingsService', () => {
  let service: ScheduleSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ScheduleSettingsService));

    service = TestBed.inject(ScheduleSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call updateScheduleSettings function', () => {
    const settings = {
      schedule_id: '2',
      period_name: 'period_name',
      end_date: 'end_date',
      new_end_date: 'new_end_date',
      link: 'link',
    };

    expect(service.updateScheduleSettings(settings, true)).toBeTruthy();
  });

  it('should updateScheduleSettings function return value', () => {
    const settings = {
      schedule_id: '2',
      period_name: 'period_name',
      end_date: 'end_date',
      new_end_date: 'new_end_date',
      link: 'link',
    };

    service.updateScheduleSettings(settings, true).subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

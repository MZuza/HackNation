import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { provideNgxLocalstorage } from 'ngx-localstorage';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { UserService } from '@app/services/user.service';
import { SharedModule } from '@app/shared/shared.module';
import { ScheduleTableViewDetailsAction } from '@app/user/schedule/table/domain/actions/ScheduleTableViewDetailsAction';
import { ButtonConfig } from '@app/user/schedule/table/domain/button-config';
import { ScheduleTableConfig } from '@app/user/schedule/table/domain/schedule-table.config';
import { ScheduleTableComponent } from '@app/user/schedule/table/schedule-table.component';
import { UserModule } from '@app/user/user.module';

describe('Schedule Table Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule,
        UserModule,
        ScheduleTableComponent,
        TranslateModule.forRoot({
          parser: {
            provide: TranslateParser,
            useClass: TranslateICUParser,
          },
          defaultLanguage: 'pl',
          useDefaultLang: true,
        }),
      ],
      providers: [
        NotificationsFrontService,
        NotificationsService,
        UserService,
        provideNgxLocalstorage({ prefix: 'mcod' }),
        provideRouter([]),
        provideHttpClientTesting(),
        provideHttpClient()
      ],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    expect(scheduleTableComponent).toBeTruthy();
  });

  it('should skip init when config is empty', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;

    fixture.detectChanges();

    expect(scheduleTableComponent.isReady).toBeFalsy();
  });

  it('should skip init only when config is not empty', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    scheduleTableComponent.config = new ScheduleTableConfig.builder()
      .default()
      .withLeftButton(new ButtonConfig('Przywróć do realizacji', undefined, () => {}))
      .withActions([new ScheduleTableViewDetailsAction('/representative')])
      .withFullExport(true)
      .withPartialExport(true)
      .withExportSource('user_schedules')
      .withSettingsForm(false)
      .build();

    fixture.detectChanges();

    expect(scheduleTableComponent.isReady).toBeTruthy();
  });

  it('should show confirmation dialog with proper id', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    fixture.detectChanges();

    scheduleTableComponent.showDeleteConfirmation('1');

    expect(scheduleTableComponent.itemToDelete).toBe('1');
  });

  it('should set item to delete id to empty string on dialog close', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    fixture.detectChanges();

    scheduleTableComponent.closeDialog();

    expect(scheduleTableComponent.itemToDelete).toBe('');
  });

  it('should emit proper id on delete', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    fixture.detectChanges();
    let emittedItemToDeleteId;
    scheduleTableComponent.deleteItemEmitter.subscribe(itemId => (emittedItemToDeleteId = itemId));

    scheduleTableComponent.deleteItem('1');

    expect(emittedItemToDeleteId).toBe('1');
  });

  it('should emits event when schedule settings was updated', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(scheduleTableComponent.scheduleSettingsUpdated, 'next');
    const settings = { schedule_id: '1', period_name: '', end_date: '', new_end_date: '', link: '' };
    scheduleTableComponent.onScheduleSettingsUpdated(settings);
    expect(scheduleTableComponent.scheduleSettingsUpdated.next).toHaveBeenCalled();
  });

  it('should view mouse leave event, clears focus', () => {
    const fixture = TestBed.createComponent(ScheduleTableComponent);
    const scheduleTableComponent = fixture.componentInstance;
    fixture.detectChanges();
    scheduleTableComponent.onMouseLeave();
    expect(scheduleTableComponent.hoveredRowIndex).toEqual(-1);
  });
});

import { NgIf } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ScheduleStatusSwitcherComponent } from '../../components/schedule-status-switcher/schedule-status-switcher.component';
import { ScheduleStatusComponent } from '../../components/schedule-status/schedule-status.component';
import { ScheduleTabComponent } from '../../tab/schedule-tab.component';
import { ConfirmationModalComponent } from '../../table/components/confirmation-modal/confirmation-modal.component';
import { ScheduleTableComponent } from '../../table/schedule-table.component';
import { ScheduleSearchSuggestComponent } from './components/search-suggest/schedule-search-suggest.component';

import { ApiModel } from '@app/services/api/api-model';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { Role } from '@app/shared/user-permissions/Role';
import { ScheduleTableDeleteAction } from '@app/user/schedule/table/domain/actions/ScheduleTableDeleteAction';
import { ScheduleTableEditAction } from '@app/user/schedule/table/domain/actions/ScheduleTableEditAction';
import { ScheduleTableViewDetailsAction } from '@app/user/schedule/table/domain/actions/ScheduleTableViewDetailsAction';
import { ButtonConfig } from '@app/user/schedule/table/domain/button-config';
import { ColumnDefinition } from '@app/user/schedule/table/domain/column.definition';
import { ScheduleTableConfig } from '@app/user/schedule/table/domain/schedule-table.config';
import { Schedule, ScheduleSettings, UserSchedule } from '@app/user/schedule/tabs/planning/domain/schedule';
import { SchedulePlanningService } from '@app/user/schedule/tabs/planning/schedule-planning.service';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

/**
 * Schedule Planning Component
 */
@Component({
    selector: 'app-schedule-planning',
    templateUrl: './schedule-planning.component.html',
    styles: [],
    standalone: true,
    imports: [
        ScheduleTabComponent,
        NgIf,
        ScheduleTableComponent,
        PermissionDirective,
        ScheduleStatusSwitcherComponent,
        ScheduleStatusComponent,
        ScheduleSearchSuggestComponent,
        ConfirmationModalComponent,
        TranslatePipe,
    ],
})
export class SchedulePlanningComponent implements OnInit, OnDestroy {
  /**
   * Admin search ref
   * @type {TemplateRef<any>}
   */
  @ViewChild('templateRef', { static: true })
  adminSearchRef: TemplateRef<any>;

  /**
   * Columns definition
   * @type {Array<ColumnDefinition>}
   */
  columns: Array<ColumnDefinition>;

  /**
   * Table config
   * @type {ScheduleTableConfig}
   */
  config: ScheduleTableConfig;

  /**
   * Data source
   * @type {Schedule}
   */
  dataSource: Schedule | UserSchedule;

  /**
   * @ignore
   */
  Role: typeof Role = Role;

  /**
   * @ignore
   */
  apiModel: typeof ApiModel = ApiModel;

  /**
   * Representative view flag
   * @type {boolean}
   */
  isRepresentativeView: boolean;

  /**
   * Ready flag
   * @type {boolean}
   */
  isReady: boolean;

  /**
   * Item to delete id
   * @type {string}
   */
  itemToDelete: string;

  /**
   * Determine if user is admin
   * @type {boolean}
   */
  isAdmin: boolean;

  /**
   * Start new period dialog visibility flag
   * @type {boolean}
   */
  isStartNewPeriodConfirmationDialogVisible: boolean;

  /**
   * Cleanup subscriptions
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * @param injector
   * @param seoService
   * @param userService
   * @param activatedRoute
   * @param schedulePlanningService
   * @param notificationsService
   * @param notificationsFrontService
   */
  constructor(
    private readonly injector: Injector,
    private seoService: SeoService,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly schedulePlanningService: SchedulePlanningService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsFrontService: NotificationsFrontService,
  ) {}

  /**
   * Setups component
   */
  ngOnInit(): void {
    this.seoService.setPageTitle(['Planowanie', 'Harmonogram otwierania danych']);

    this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.notificationsService.clearAlerts();
      const hasChildRoute = this.activatedRoute.snapshot.children && this.activatedRoute.snapshot.children.length > 0;
      if (hasChildRoute) {
        return;
      }
      this.setupTable();
    });
    this.schedulePlanningService
      .isTableShouldBeReloaded()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.setupTable();
      });
  }

  /**
   * Cleanups subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Changes schedule status
   * @param status
   */
  changeScheduleStatus(status: boolean) {
    this.schedulePlanningService.updateScheduleStatus((this.dataSource as UserSchedule).userScheduleId, status).subscribe(() => {
      this.dataSource = Object.assign(this.dataSource, { completed: !(this.dataSource as UserSchedule).completed });
      this.config = this.getRepresentativeScheduleViewConfig();
    });
  }

  /**
   * Blocks schedule
   * @param status
   */
  blockSchedule(status: boolean) {
    this.schedulePlanningService.blockSchedule(status).subscribe(() => {
      this.dataSource = Object.assign(this.dataSource, { isBlocked: !(this.dataSource as UserSchedule).isBlocked });
    });
  }

  /**
   * Delete item
   * @param id
   */
  deleteItem(id: string) {
    this.schedulePlanningService.deleteScheduleItem(id).subscribe(() => {
      this.itemToDelete = '';
      this.notificationsFrontService.clearAlerts();
      this.notificationsFrontService.addSuccess('Zmiany zostały zapisane');
      this.dataSource = Object.assign({}, this.dataSource, { data: this.dataSource.data.filter(item => item.id !== id) });
    });
  }

  /**
   * Opens new schedule
   */
  openNewSchedule() {
    this.schedulePlanningService.openNewSchedule().subscribe(schedule => {
      this.dataSource = schedule;
      this.isStartNewPeriodConfirmationDialogVisible = false;
    });
  }

  /**
   * Updates schedule with new settings
   * @param scheduleSettings
   */
  updateScheduleAfterSettingsChanged(scheduleSettings: ScheduleSettings): void {
    this.dataSource = ScheduleService.getScheduleWithNewSettings(this.dataSource, scheduleSettings);
  }

  /**
   * Closes dialog
   */
  closeDialog() {
    this.isStartNewPeriodConfirmationDialogVisible = false;
  }

  /**
   * Configure table for admin view mode
   */
  private configureAdminScheduleView() {
    this.columns = [
      new ColumnDefinition('representative', 'Pełnomocnik'),
      new ColumnDefinition('institution', 'Instytucja'),
      new ColumnDefinition('datasetsCount', 'Liczba zasobów'),
      new ColumnDefinition('isReady', 'Gotowe', [Role.ADMIN]),
      new ColumnDefinition('recommendations', 'Rekomendacje'),
    ];
    this.schedulePlanningService.getRepresentativesSchedules().subscribe(schedules => {
      this.dataSource = schedules;

      const isDataEmpty = !!!this.dataSource?.data.length;
      this.config = new ScheduleTableConfig.builder()
        .default()
        .withLeftButton(new ButtonConfig('Otwórz nowy okres', undefined, this.startNewPeriod()))
        .withActions([new ScheduleTableViewDetailsAction('/representative')])
        .withFullExport(!isDataEmpty)
        .withPartialExport(!isDataEmpty)
        .build();

      this.isReady = true;
    });
  }

  /**
   * Shows start new period confirmations
   * @returns {() => void}
   */
  private startNewPeriod(): () => void {
    return () => {
      this.isStartNewPeriodConfirmationDialogVisible = true;
    };
  }

  /**
   * Configure table for representative view mode
   */
  private configureRepresentativeScheduleView() {
    const datasetsColumnDefinition = this.isAdmin
      ? new ColumnDefinition('datasets', 'Zasoby danych', [Role.ADMIN], this.adminSearchRef)
      : new ColumnDefinition('datasets', 'Zasoby danych');

    this.columns = [
      new ColumnDefinition('institution', 'Instytucja'),
      new ColumnDefinition('department', 'Jednostka podłegła - nadzorowana'),
      datasetsColumnDefinition,
      new ColumnDefinition('creationDate', 'Data utworzenia'),
      new ColumnDefinition('recommendations', 'Rekomendacja', [Role.ADMIN]),
    ];

    this.schedulePlanningService
      .getSchedulesItemForCurrentSchedule(this.isAdmin ? Number(this.activatedRoute.snapshot.paramMap.get('representativeId')) : undefined)
      .subscribe(schedule => {
        this.dataSource = schedule;
        this.config = this.getRepresentativeScheduleViewConfig();
        this.isReady = true;
      });
  }

  /**
   * Gets representative schedule view config
   * @returns {ScheduleTableConfig}
   */
  private getRepresentativeScheduleViewConfig() {
    const isCompleted = (this.dataSource as UserSchedule)?.completed;
    const isDataEmpty = !!!this.dataSource?.data.length;
    const isBlocked = this.dataSource?.isBlocked;
    return new ScheduleTableConfig.builder()
      .default()
      .withLeftButton(
        this.isAdmin || (!isCompleted && !isBlocked && !this.isAdmin) ? new ButtonConfig('Dodaj zgłoszenie', ['add-new']) : undefined,
      )
      .withActions(
        this.isAdmin || (!isCompleted && !this.isAdmin && !isBlocked && !this.isAdmin)
          ? [new ScheduleTableEditAction(this.isAdmin ? '/edit' : ''), new ScheduleTableDeleteAction()]
          : [new ScheduleTableViewDetailsAction('')],
      )
      .withFullExport(this.isAdmin && !isDataEmpty)
      .withPartialExport(!isDataEmpty)
      .withExportSource('user_schedules')
      .build();
  }

  /**
   * Setups table
   */
  private setupTable(): void {
    this.isAdmin = this.userService.hasRequiredRole([Role.ADMIN]);
    if (this.isAdmin && !this.activatedRoute.snapshot.paramMap.get('representativeId')) {
      this.isRepresentativeView = false;
      this.configureAdminScheduleView();
    } else {
      this.isRepresentativeView = true;
      this.configureRepresentativeScheduleView();
    }
  }
}

import { NgIf } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScheduleTabComponent } from '../../tab/schedule-tab.component';
import { ConfirmationModalComponent } from '../../table/components/confirmation-modal/confirmation-modal.component';
import { ScheduleTableComponent } from '../../table/schedule-table.component';
import { SchedulePlanningService } from '../planning/schedule-planning.service';

import { toggleVertically } from '@app/animations';
import { ApiModel } from '@app/services/api/api-model';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
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
import { Schedule, ScheduleSettings } from '@app/user/schedule/tabs/planning/domain/schedule';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

@Component({
    selector: 'app-schedule-in-progress',
    templateUrl: './schedule-in-progress.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [ScheduleTabComponent, NgIf, ScheduleTableComponent, PermissionDirective, ConfirmationModalComponent]
})
export class ScheduleInProgressComponent implements OnInit, OnDestroy {

    /**
     *  Link template reference
     * @type {TemplateRef<any>}
     */
    @ViewChild('linkTemplateRef', {static: true})
    linkTemplateRef: TemplateRef<any>;

    /**
     * Table columns
     * @type {Array<ColumnDefinition>}
     */
    columns: Array<ColumnDefinition>;

    /**
     * Table config
     * @type {ScheduleTableConfig}
     */
    config: ScheduleTableConfig;

    /**
     * Schedule data
     * @type {Schedule}
     */
    dataSource: Schedule;

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
     * Schedules view flag
     * @type {boolean}
     */
    isSchedulesView: boolean;

    /**
     * Ready flag
     * @type {boolean}
     */
    isReady: boolean;


    /**
     * Remove success message visibility
     * @type {boolean}
     */
    isRemoveSuccessMessageVisible: boolean;

    /**
     * Delete confirmation modal visible
     * @type {boolean}
     */
    isDeleteConfirmationModalVisible: boolean;

    /**
     * Determine if user is admin
     * @type {boolean}
     */
    isAdmin: boolean;

    /**
     * Cleanup subscription on destroy
     * @type {Subject<void>}
     */
    private destroy$: Subject<void> = new Subject<void>();

    /**
     * Timeout cleanup
     * @type {any}
     */
    private removeMessageSuccessTimeout: any;

    /**
     * @ignore
     * @param injector
     * @param userService
     * @param activatedRoute
     * @param router
     * @param localizeRouterService
     * @param inProgressService
     */
    constructor(private readonly injector: Injector,
                private seoService: SeoService,
                private readonly userService: UserService,
                private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                private localizeRouterService: LocalizeRouterService,
                private readonly inProgressService: ScheduleService,
                private readonly schedulePlanningService: SchedulePlanningService,
                private readonly notificationsFrontService: NotificationsFrontService) {
    }

    /**
     * Setups table
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Realizacja', 'Harmonogram otwierania danych']);

        this.activatedRoute.url
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const hasChildRoute = this.activatedRoute.snapshot.children && this.activatedRoute.snapshot.children.length > 0;
                if (hasChildRoute) {
                    return;
                }
                this.handleActivatedRouteChange();
            });
    }

    /**
     * Cleanups component
     */
    ngOnDestroy() {
        this.destroy$.next();
        clearTimeout(this.removeMessageSuccessTimeout);
    }

    /**
     * Moves schedule to archive
     */
    movesScheduleToArchive(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.inProgressService.moveScheduleToArchive(Number(id)).subscribe(() => {
            this.isDeleteConfirmationModalVisible = false;
            this.router.navigate(this.localizeRouterService.translateRoute(['/!user/!dashboard/!schedule/!in-progress']) as any [],
                {state: {isRemoved: true}});
        });
    }

    /**
     * Deletes item from the list
     * @param {string} id
     */
    deleteItem(id: string) {
        this.schedulePlanningService.deleteScheduleItem(id)
            .subscribe(() => {
                this.notificationsFrontService.clearAlerts();
                this.notificationsFrontService.addSuccess('Zmiany zostały zapisane');
                this.dataSource = Object.assign({}, this.dataSource, {data: this.dataSource.data.filter(item => item.id !== id)});
            });
    }

    /**
     * Closes dialog
     * @param isClickedOutside
     */
    closeDialog(isClickedOutside: boolean) {
        if (!isClickedOutside) {
            this.isDeleteConfirmationModalVisible = false;
        }
    }

    /**
     * Handles activated route change
     */
    private handleActivatedRouteChange(): void {
        this.isAdmin = this.userService.hasRequiredRole([Role.ADMIN]);
        const isOnlyIdParamProvided = this.activatedRoute.snapshot.paramMap.keys.length === 1;
        if (this.activatedRoute.snapshot.paramMap.keys.length === 0) {
            this.configureSchedulesView();
            return;
        }
        if (isOnlyIdParamProvided) {
            if (this.isAdmin && !this.activatedRoute.snapshot.paramMap.get('representativeId')) {
                this.isRepresentativeView = false;
                this.configureAdminScheduleView();
            } else {
                this.isRepresentativeView = true;
                this.configureRepresentativesScheduleView();
            }
        } else {
            this.isRepresentativeView = true;
            this.configureRepresentativesScheduleView();
        }
    }

    /**
     * Configures table for admin mode
     */
    private configureAdminScheduleView() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.columns = [new ColumnDefinition('representative',
            'Pełnomocnik'), new ColumnDefinition('institution', 'Instytucja'),
            new ColumnDefinition('datasetsCount', 'Liczba zasobów'),
            new ColumnDefinition('recommendations', 'Akceptacje'),
            new ColumnDefinition('implementedItems', 'Realizacje')];
        this.config = new ScheduleTableConfig.builder()
            .default()
            .withLeftButton(new ButtonConfig('Przenieś do archiwum', undefined, () => {
                this.isDeleteConfirmationModalVisible = true;
            }))
            .withActions([new ScheduleTableViewDetailsAction('/representative')])
            .withFullExport(true)
            .withPartialExport(true)
            .build();
        this.inProgressService
            .getRepresentativesSchedules(id, 'implemented')
            .subscribe(schedules => {
                this.dataSource = schedules;
                this.isReady = true;
            });

    }

    /**
     * Configure table for representative mode
     */
    private configureRepresentativesScheduleView() {
        this.columns = [new ColumnDefinition('institution', 'Instytucja'),
            new ColumnDefinition('department', 'Jednostka podłegła - nadzorowana'),
            new ColumnDefinition('datasets', 'Zasoby danych'),
            new ColumnDefinition('creationDate', 'Data utworzenia', undefined, undefined, 'text-nowrap'),
            new ColumnDefinition('accepted', 'Zaakceptowane', ),
            new ColumnDefinition('finished', 'Zrealizowane', )
        ];

        const editAction = new ScheduleTableEditAction('/edit');

        const actions = this.isAdmin ? [editAction, new ScheduleTableDeleteAction()]
            : [editAction];

        this.inProgressService
            .getSchedulesItemForCurrentSchedule(Number(this.activatedRoute.snapshot.paramMap.get('id')),
                this.isAdmin,
                Number(this.activatedRoute.snapshot.paramMap.get('representativeId')))
            .subscribe(schedule => {
                this.config = new ScheduleTableConfig.builder()
                    .default()
                    .withLeftButton(!this.isAdmin ? null : new ButtonConfig('Dodaj zgłoszenie', ['add-new']))
                    .withActions(actions)
                    .withFullExport(this.isAdmin && true)
                    .withPartialExport(schedule.data.length > 0)
                    .withExportSource('user_schedules')
                    .build();

                this.dataSource = schedule;
                this.isReady = true;
            });

    }

    /**
     * Configure table for schedules list view mode
     */
    private configureSchedulesView(): void {
        this.showMessageWhenNecessary();
        this.isSchedulesView = true;
        this.columns = [
            new ColumnDefinition('period', 'Okres'),
            new ColumnDefinition('link', 'Opublikowany harmonogram', undefined, this.linkTemplateRef)
        ];
        this.config = new ScheduleTableConfig.builder()
            .default()
            .withActions([new ScheduleTableViewDetailsAction()])
            .withSettingsForm(false)
            .build();
        this.inProgressService
            .getSchedules('implemented')
            .subscribe(schedules => {
                this.dataSource = schedules;
                this.isReady = true;
            });

    }

    /**
     * Shows confirmation message
     */
    private showMessageWhenNecessary(): void {
        this.isRemoveSuccessMessageVisible = this.router.getCurrentNavigation()?.extras?.state?.isRemoved;
        if (this.isRemoveSuccessMessageVisible) {
            if (this.removeMessageSuccessTimeout) {
              clearTimeout(this.removeMessageSuccessTimeout);
            }
            this.removeMessageSuccessTimeout = setTimeout(() => {
                this.isRemoveSuccessMessageVisible = false;
            }, 7000);
        }
    }

    /**
     * Updates schedule with new settings
     * @param scheduleSettings
     */
    updateScheduleAfterSettingsChanged(scheduleSettings: ScheduleSettings): void {
        this.dataSource = ScheduleService.getScheduleWithNewSettings(this.dataSource, scheduleSettings);
    }
}

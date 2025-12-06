import { NgIf } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScheduleTabComponent } from '../../tab/schedule-tab.component';
import { ConfirmationModalComponent } from '../../table/components/confirmation-modal/confirmation-modal.component';
import { ScheduleTableComponent } from '../../table/schedule-table.component';

import { toggleVertically } from '@app/animations';
import { ApiModel } from '@app/services/api/api-model';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { Role } from '@app/shared/user-permissions/Role';
import { ScheduleTableEditAction } from '@app/user/schedule/table/domain/actions/ScheduleTableEditAction';
import { ScheduleTableViewDetailsAction } from '@app/user/schedule/table/domain/actions/ScheduleTableViewDetailsAction';
import { ButtonConfig } from '@app/user/schedule/table/domain/button-config';
import { ColumnDefinition } from '@app/user/schedule/table/domain/column.definition';
import { ScheduleTableConfig } from '@app/user/schedule/table/domain/schedule-table.config';
import { Schedule, ScheduleSettings, UserSchedule } from '@app/user/schedule/tabs/planning/domain/schedule';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

/**
 * Schedule Archive Component
 */
@Component({
    selector: 'app-schedule-archive',
    templateUrl: './schedule-archive.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [ScheduleTabComponent, NgIf, ScheduleTableComponent, PermissionDirective, ConfirmationModalComponent]
})
export class ScheduleArchiveComponent implements OnInit, OnDestroy {

    /**
     * Link template reference
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
                private readonly inProgressService: ScheduleService) {
    }

    /**
     * Setups table
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Archiwum', 'Harmonogram otwierania danych']);

        this.activatedRoute.url
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.handleActivatedRouteChange();
            });
    }

    /**
     * Handles activated route change
     */
    private handleActivatedRouteChange(): void {
        this.isAdmin = this.userService.hasRequiredRole([Role.ADMIN]);
        const isOnlyIdParamProvided = this.activatedRoute.snapshot.paramMap.keys.length === 1;
        if (this.activatedRoute.snapshot.paramMap.keys.length === 0) {
            this.configureSchedulesListView();
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
     * Cleanups component
     */
    ngOnDestroy() {
        this.destroy$.next();
        clearTimeout(this.removeMessageSuccessTimeout);
    }

    /**
     * Restore schedule to planning state
     */
    restoreScheduleToPlanning(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.inProgressService.restoreScheduleToImplemented(Number(id)).subscribe(() => {
            this.isDeleteConfirmationModalVisible = false;
            this.router.navigate(this.localizeRouterService.translateRoute(['/!user/!dashboard/!schedule/!archive']) as any [],
                {state: {isRemoved: true}});
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
            .withLeftButton(new ButtonConfig('Przywróć do realizacji', undefined, () => {
                this.isDeleteConfirmationModalVisible = true;
            }))
            .withActions([new ScheduleTableViewDetailsAction('/representative')])
            .withFullExport(true)
            .withPartialExport(true)
            .build();
        this.inProgressService
            .getRepresentativesSchedules(id, 'archived')
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


        this.inProgressService
            .getSchedulesItemForCurrentSchedule(Number(this.activatedRoute.snapshot.paramMap.get('id')),
                this.isAdmin,
                Number(this.activatedRoute.snapshot.paramMap.get('representativeId')))
            .subscribe(schedule => {
                this.config = new ScheduleTableConfig.builder()
                    .default()
                    .withActions([this.isAdmin ? new ScheduleTableEditAction('/edit') :
                        new ScheduleTableViewDetailsAction('/edit')])
                    .withFullExport(this.isAdmin && true)
                    .withPartialExport(!!schedule?.data.length)
                    .withExportSource('user_schedules')
                    .build();

                const hasChildRoute = this.activatedRoute.snapshot.children && this.activatedRoute.snapshot.children.length > 0;
                if (hasChildRoute) {
                    return;
                }
                this.dataSource = schedule;
                this.isReady = true;
            });

    }

    /**
     * Configure table for schedules list view mode
     */
    private configureSchedulesListView() {
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
            .getSchedules('archived')
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

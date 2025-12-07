import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogingovplErrorPageComponent } from '@app/user/logingovpl/logingovpl-error-page/logingovpl-error-page.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { SchedulePlanningFormComponent } from './schedule/forms/schedule-planning-form/schedule-planning-form.component';

import { RoleGuard } from '@app/services/user-permissions/role.guard';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { LostPasswordComponent } from '@app/user//auth/lost-password/lost-password.component';
import { AcademyCoursesComponent } from '@app/user/academy/academy-courses/academy-courses.component';
import { AcademyInfoComponent } from '@app/user/academy/academy-info/academy-info.component';
import { AcademyComponent } from '@app/user/academy/academy.component';
import { AuthGuard } from '@app/user/auth/auth.guard';
import { LoginComponent } from '@app/user/auth/login/login.component';
import { LogoutComponent } from '@app/user/auth/logout/logout.component';
import { RegisterComponent } from '@app/user/auth/register/register.component';
import { ResetPasswordComponent } from '@app/user/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from '@app/user/auth/verify-email/verify-email.component';
import { ChangePasswordComponent } from '@app/user/change-password/change-password.component';
import { DashboardComponent } from '@app/user/dashboard/dashboard.component';
import { ActiveDataProposalComponent } from '@app/user/data-proposal/active/active-data-proposal.component';
import { DataProposalComponent } from '@app/user/data-proposal/data-proposal.component';
import { DataProposalDetailsComponent } from '@app/user/data-proposal/details/data-proposal-details.component';
import { InactiveDataProposalComponent } from '@app/user/data-proposal/inactive/inactive-data-proposal.component';
import { FollowedDatasetsComponent } from '@app/user/followed/followed-datasets/followed-datasets.component';
import { FollowedObjectActivityComponent } from '@app/user/followed/followed-object-activity/followed-object-activity.component';
import { FollowedObjectTabsComponent } from '@app/user/followed/followed-object-tabs/followed-object-tabs.component';
import { FollowedQueryComponent } from '@app/user/followed/followed-query/followed-query.component';
import { FollowedComponent } from '@app/user/followed/followed.component';
import { ForumRegulationsComponent } from '@app/user/forum-regulations/forum-regulations.component';
import { LabAnalysesComponent } from '@app/user/lab/lab-analyses/lab-analyses.component';
import { LabInfoComponent } from '@app/user/lab/lab-info/lab-info.component';
import { LabResearchesComponent } from '@app/user/lab/lab-researches/lab-researches.component';
import { LabComponent } from '@app/user/lab/lab.component';
import { MeetingsComponent } from '@app/user/meetings/meetings.component';
import { MyDashboardComponent } from '@app/user/my-dashboard/my-dashboard.component';
import { MyFollowedComponent } from '@app/user/my-followed/my-followed.component';
import { ScheduleComponent } from '@app/user/schedule/schedule.component';
import { ScheduleArchiveComponent } from '@app/user/schedule/tabs/archive/schedule-archive.component';
import { ScheduleInProgressComponent } from '@app/user/schedule/tabs/in-progress/schedule-in-progress.component';
import { SchedulePlanningComponent } from '@app/user/schedule/tabs/planning/schedule-planning.component';
import { SearchHistoryComponent } from '@app/user/search-history/search-history.component';
import { DashboardStatsComponent } from '@app/user/stats/dashboard-stats.component';

const routes: Routes = [
    {path: '!login', component: LoginComponent},
    {path: '!logingovpl-error', component: LogingovplErrorPageComponent},
    {path: '!logout', component: LogoutComponent, canActivate: [AuthGuard]},
    {path: '!lost-password', component: LostPasswordComponent},
    {path: '!reset-password/!:token', component: ResetPasswordComponent},
    {path: '!reset-password', component: ResetPasswordComponent},
    {path: '!verify-email/!:token', component: VerifyEmailComponent},
    {path: '!register', component: RegisterComponent},
    {
        path: '!dashboard', component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: '!desktop', pathMatch: 'full'},
            {path: '!change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
            {
                path: '!academy', component: AcademyComponent, canActivate: [RoleGuard],
                data: {roles: PermissionPerRoles.BROWSE_AOD},
                children: [
                    {path: '', redirectTo: '!courses', pathMatch: 'full'},
                    {path: '!info', component: AcademyInfoComponent},
                    {path: '!courses', component: AcademyCoursesComponent}
                ]
            },
            {path: '!desktop', component: MyDashboardComponent},
            {
                path: '!my', component: MyFollowedComponent, children: [
                    {path: '', redirectTo: '!followed', pathMatch: 'full'},
                    {path: '!search-history', component: SearchHistoryComponent},
                    {
                        path: '!followed', component: FollowedComponent, children: [
                            {path: '', redirectTo: '!dataset', pathMatch: 'full'},
                            {
                                path: '!dataset', component: FollowedObjectTabsComponent, children: [
                                    {path: '', redirectTo: '!list', pathMatch: 'full'},
                                    {path: '!list', component: FollowedDatasetsComponent},
                                    {path: '!activity', component: FollowedObjectActivityComponent, data: {type: 'dataset'}}
                                ],
                                data: {labelledBy: 'tabFollowedDatasets'}
                            },
                            {
                                path: '!query', component: FollowedObjectTabsComponent, children: [
                                    {path: '', redirectTo: '!list', pathMatch: 'full'},
                                    {path: '!list', component: FollowedQueryComponent},
                                    {path: '!activity', component: FollowedObjectActivityComponent, data: {type: 'query'}}
                                ],
                                data: {labelledBy: 'tabFollowedQueries'}
                            },
                            {path: '**', redirectTo: 'dataset'}]
                    },
                    {path: '**', redirectTo: 'followed'}
                ]
            },
            {path: '!stats', component: DashboardStatsComponent},
            {
                path: '!lab', component: LabComponent, children: [
                    {path: '', redirectTo: '!analyses', pathMatch: 'full'},
                    {path: '!info', component: LabInfoComponent},
                    {path: '!analyses', component: LabAnalysesComponent},
                    {path: '!researches', component: LabResearchesComponent}
                ]
            },
            {
                path: '!data-proposal', component: DataProposalComponent,
                canActivate: [RoleGuard],
                data: {roles: PermissionPerRoles.BROWSE_NEW_DATA_PROPOSAL},
                children: [
                    {path: '', redirectTo: '!active', pathMatch: 'full'},
                    {
                        path: '!active', component: ActiveDataProposalComponent, children: [
                            {path: '!details/!:id', component: DataProposalDetailsComponent}
                        ]
                    },
                    {
                        path: '!inactive', component: InactiveDataProposalComponent, children: [
                            {path: '!details/!:id', component: DataProposalDetailsComponent}
                        ]
                    }
                ]
            },
            {
                path: '!meetings',
                component: MeetingsComponent,
                canActivate: [RoleGuard],
                data: {roles: PermissionPerRoles.BROWSE_MEETINGS}
            },
            {
                path: '!schedule',
                component: ScheduleComponent,
                children: [
                    {path: '', redirectTo: '!planning', pathMatch: 'full'},
                    {
                        path: '!planning', component: SchedulePlanningComponent,
                        children: [
                            {path: '!add-new', component: SchedulePlanningFormComponent},
                            {path: '!:userScheduleId', component: SchedulePlanningFormComponent},
                            {path: '!representative/!:representativeId', component: SchedulePlanningComponent},
                            {path: '!representative/!:representativeId/!add-new', component: SchedulePlanningFormComponent},
                            {path: '!representative/!:representativeId/!edit/!:userScheduleId', component: SchedulePlanningFormComponent}
                        ]
                    },
                    {path: '!in-progress', component: ScheduleInProgressComponent, children: [
                            {path: '!:id', component: ScheduleInProgressComponent},
                            {path: '!:id/!representative/!:representativeId', component: ScheduleInProgressComponent},
                            {path: '!:id/!edit/!:userScheduleId', component: SchedulePlanningFormComponent},
                            {path: '!:id/!representative/!:representativeId/!add-new', component: SchedulePlanningFormComponent},
                            {path: '!:id/!representative/!:representativeId/!edit/!:userScheduleId', component: SchedulePlanningFormComponent}
                        ]},
                    {path: '!archive', component: ScheduleArchiveComponent, children: [
                            {path: '!:id', component: ScheduleArchiveComponent},
                            {path: '!:id/!representative/!:representativeId', component: ScheduleArchiveComponent},
                            {path: '!:id/!edit/!:userScheduleId', component: SchedulePlanningFormComponent},
                            {path: '!:id/!representative/!:representativeId/!edit/!:userScheduleId', component: SchedulePlanningFormComponent}
                        ]}
                ]
            },
            {
                path: '!forum-regulations',
                component: ForumRegulationsComponent,
                canActivate: [AuthGuard]
            },
            {path: '**', redirectTo: 'followed'}
        ]
    }];

/**
 * @ignore
 */
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        LocalizeRouterModule.forChild(routes),
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class UserRoutingModule {
}

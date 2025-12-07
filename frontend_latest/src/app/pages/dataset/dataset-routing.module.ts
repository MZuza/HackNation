import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { DatasetItemComponent } from './dataset-item/dataset-item.component';
import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetResourceComponent } from './dataset-resource/dataset-resource.component';
import { SubmissionItemComponent } from './submission-item/submission-item.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SuggestDatasetComponent } from './suggest-dataset/suggest-dataset.component';

import { DatasetParentComponent } from '@app/pages/dataset/dataset-parent/dataset-parent.component';
import { DatasetResourceMapComponent } from '@app/pages/dataset/dataset-resource-map/dataset-resource-map.component';
import { RoleGuard } from '@app/services/user-permissions/role.guard';
import { breadcrumbsDatasetResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dataset.resolver';
import { breadcrumbsResourceResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-resource.resolver';
import { breadcrumbsSubmissionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-submission.resolver';
import { offlineResourceResolver } from '@app/shared/breadcrumbs/resolvers/offline-resource.resolver';
import { ResourceChartComponent } from '@app/shared/resource-chart/resource-chart.component';
import { ResourceTableNoFiltersComponent } from '@app/shared/resource-table-no-filters/resource-table-no-filters.component';
import { Role } from '@app/shared/user-permissions/Role';

const routes: Routes = [
  { path: '', component: DatasetComponent },
  { path: '!sparql', loadChildren: () => import('./sparql/sparql.module').then(m => m.SparqlModule) },
  { path: '!submissions', component: SuggestDatasetComponent },
  { path: '!submissions/!accepted', component: SubmissionListComponent },
  {
    path: '!submissions/!accepted/!:id',
    component: SubmissionItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.data.attributes.title' },
    },
    resolve: {
      post: breadcrumbsSubmissionResolver,
    },
  },
  {
    path: '!:id',
    component: DatasetParentComponent,
    data: {
      breadcrumbs: { dataKey: 'post.data.attributes.title' },
    },
    resolve: {
      post: breadcrumbsDatasetResolver,
    },
    children: [
      {
        path: '',
        component: DatasetItemComponent,
        resolve: {
          post: offlineResourceResolver,
        },
      },
      {
        path: '!resource/!:resourceId',
        component: DatasetResourceComponent,
        data: {
          breadcrumbs: { dataKey: 'post.attributes.title' },
        },
        resolve: {
          post: breadcrumbsResourceResolver,
        },
        children: [
          { path: '', redirectTo: '!table', pathMatch: 'full' },
          {
            path: '!table',
            component: ResourceTableNoFiltersComponent,
            resolve: {
              post: offlineResourceResolver,
            },
          },
          { path: '!chart', component: ResourceChartComponent },
          { path: '!map', component: DatasetResourceMapComponent },
        ],
      },
      {
        path: '!resource/!:resourceId/!preview',
        component: DatasetResourceComponent,
        data: {
          breadcrumbs: { dataKey: 'post.attributes.title' },
          editorPreview: true,
          roles: [Role.ADMIN, Role.EDITOR],
        },
        resolve: {
          post: breadcrumbsResourceResolver,
        },
        canActivate: [RoleGuard],
        children: [
          { path: '', redirectTo: '!table', pathMatch: 'full' },
          { path: '!table', component: ResourceTableNoFiltersComponent },
          { path: '!chart', component: ResourceChartComponent },
          { path: '!map', component: DatasetResourceMapComponent },
        ],
      },
    ],
  },
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule],
})
export class DatasetRoutingModule {}

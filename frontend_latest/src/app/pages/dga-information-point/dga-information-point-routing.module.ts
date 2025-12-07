import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import {
  DgaInformationPointCmsDetailsComponent
} from '@app/pages/dga-information-point/dga-information-point-cms-details/dga-information-point-cms-details.component';
import {
  DgaInformationPointTablePageComponent
} from '@app/pages/dga-information-point/dga-information-point-table-page/dga-information-point-table-page.component';
import {
  DgaInformationPointTableComponent
} from '@app/pages/dga-information-point/dga-information-point-table/dga-information-point-table.component';
import {
  DgaInformationPointTabsComponent
} from '@app/pages/dga-information-point/dga-information-point-tabs/dga-information-point-tabs.component';
import { DgaInformationPointComponent } from '@app/pages/dga-information-point/dga-information-point/dga-information-point.component';
import {
  breadcrumbsDgaInformationPointDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-data-resolver.service';
import {
  breadcrumbsDgaInformationPointTabDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-tab-data-resolver.service';
import {
  breadcrumbsDgaInformationPointTableDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-table-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DgaInformationPointComponent,
    children: [
      {
        path: '',
        component: DgaInformationPointTabsComponent,
        children: [
          {
            path: '!:id',
            component: DgaInformationPointCmsDetailsComponent,
            data: { breadcrumbs: {dataKey: 'post.title'}},
            resolve: { post: breadcrumbsDgaInformationPointDataResolverService }
          },
        ],
        resolve: { post: breadcrumbsDgaInformationPointTabDataResolverService }

      },
      {
        path: '!list-protected-data',
        component: DgaInformationPointTablePageComponent,
        children: [
          { path: '', redirectTo: '!table', pathMatch: 'full' },
          {
            path: '!table',
            component: DgaInformationPointTableComponent,
          }
        ],
        data: { breadcrumbs: {dataKey: 'post.cms.title'}},
        resolve: { post: breadcrumbsDgaInformationPointTableDataResolverService },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule]
})
export class DgaInformationPointRoutingModule {}

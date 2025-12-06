import { Route } from '@angular/router';

import { BrokenLinksTableComponent } from '@app/pages/broken-links/broken-links-table/broken-links-table.component';
import { BrokenLinksComponent } from '@app/pages/broken-links/broken-links.component';
import { breadcrumbsBrokenLinksTableDataResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-broken-links-table-data.resolver';

export const BROKEN_LINKS_ROUTES: Route[] = [
  {
    path: '',
    component: BrokenLinksComponent,
    children: [
      {path: '', redirectTo: '!table', pathMatch: 'full'},
      {path: '!table', component: BrokenLinksTableComponent}
    ],
    resolve: { post: breadcrumbsBrokenLinksTableDataResolver}
  }
];

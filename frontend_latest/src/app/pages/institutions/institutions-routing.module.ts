import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { InstitutionItemComponent } from './institution-item/institution-item.component';
import { InstitutionComponent } from './institution/institution.component';

import { breadcrumbsInstitutionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-institution.resolver';

const routes: Routes = [
    { path: '', component: InstitutionComponent },
    {
        path: '!:id',
        component: InstitutionItemComponent,
        data: {
            breadcrumbs: {dataKey: 'post.attributes.title'}
        },
        resolve: {
            post: breadcrumbsInstitutionResolver
        }
    }
];

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
export class InstitutionsRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
import { MapComponent } from '@app/shared/map/map.component';
import { ResourceChartComponent } from '@app/shared/resource-chart/resource-chart.component';
import { ResourceTableNoFiltersComponent } from '@app/shared/resource-table-no-filters/resource-table-no-filters.component';


const routes: Routes = [
    {
        path: '', component: EmbedLayoutComponent, children: [{
            path: '!resource/!:resourceId',
            component: EmbeddedComponent,
            children: [
                {path: '', redirectTo: '!table', pathMatch: 'full'},
                {path: '!table', component: ResourceTableNoFiltersComponent},
                {path: '!chart', component: ResourceChartComponent},
                {path: '!map', component: MapComponent}
            ]
        },
        ]
    }
];

/**
 * @ignore
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmbeddedRoutingModule {
}

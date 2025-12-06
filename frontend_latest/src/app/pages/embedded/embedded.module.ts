import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { EmbeddedRoutingModule } from '@app/pages/embedded/embedded-routing.module';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { MapModule } from '@app/shared/map/map.module';
import { ResourceChartModule } from '@app/shared/resource-chart/resource-chart.module';
import { ResourceFilterModule } from '@app/shared/resource-filters/resource-filter.module';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        EmbeddedRoutingModule,
        SharedModule,
        MapModule,
        ResourceChartModule,
        DatepickerModule,
        ResourceFilterModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        EmbeddedComponent,
    ]
})
export class EmbeddedModule {
}

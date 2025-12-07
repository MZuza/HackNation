import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { SliderComponent } from '../slider/slider.component';

import { MapOptionsComponent } from '@app/shared/map/map-options/map-options.component';
import { MapComponent } from '@app/shared/map/map.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    exports: [MapComponent, MapOptionsComponent, SliderComponent],
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser,
            },
        }),
        SharedModule,
        MapComponent, MapOptionsComponent, SliderComponent,
    ],
})
export class MapModule {}

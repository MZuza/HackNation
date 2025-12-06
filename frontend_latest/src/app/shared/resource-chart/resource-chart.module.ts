import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { ResourceChartNameFormComponent } from './resource-chart-name-form/resource-chart-name-form.component';
import { ResourceChartSelectorComponent } from './resource-chart-selector/resource-chart-selector.component';

import { ResourceChartBarComponent } from '@app/shared/resource-chart/resource-chart-bar/resource-chart-bar.component';
import { ResourceChartCircleComponent } from '@app/shared/resource-chart/resource-chart-circle/resource-chart-circle.component';
import { ResourceChartFormComponent } from '@app/shared/resource-chart/resource-chart-form/resource-chart-form.component';
import { ResourceChartLineComponent } from '@app/shared/resource-chart/resource-chart-line/resource-chart-line.component';
import { ResourceChartScatterComponent } from '@app/shared/resource-chart/resource-chart-scatter/resource-chart-scatter.component';
import { ResourceChartComponent } from '@app/shared/resource-chart/resource-chart.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    ResourceChartBarComponent,
    ResourceChartLineComponent,
    ResourceChartComponent,
    ResourceChartFormComponent,
    ResourceChartCircleComponent,
    ResourceChartScatterComponent,
    ResourceChartSelectorComponent,
    ResourceChartNameFormComponent,
  ],
  exports: [
    ResourceChartBarComponent,
    ResourceChartLineComponent,
    ResourceChartComponent,
    ResourceChartFormComponent,
    ResourceChartCircleComponent,
    ResourceChartScatterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      parser: {
        provide: TranslateParser,
        useClass: TranslateICUParser,
      },
    }),
    RouterModule,
    LocalizeRouterModule,
    BaseChartDirective,
  ],
})
export class ResourceChartModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { ResourceFiltersComponent } from '@app/shared/resource-filters/resource-filters.component';
import { TooltipModule } from '@app/shared/tooltip/tooltip.module';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      DatepickerModule,
      TooltipModule,
      TranslateModule.forChild(),
      ResourceFiltersComponent
    ],
    exports: [ResourceFiltersComponent],
})
export class ResourceFilterModule {}

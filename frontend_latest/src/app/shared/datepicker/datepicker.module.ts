import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS, } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { plLocale } from 'ngx-bootstrap/locale';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';
import { DateInputMaskDirective } from '@app/shared/datepicker/date-input-mask.directive';
import { DatepickerComponent } from '@app/shared/datepicker/datepicker.component';
import { McodMatDatepickerIntl } from '@app/shared/datepicker/McodMatDatepickerIntl';
import { SharedModule } from '@app/shared/shared.module';

defineLocale('pl', plLocale);

@NgModule({
    exports: [
        DatepickerComponent,
        DateRangePickerComponent,
    ],
    imports: [
        CommonModule,
        BsDatepickerModule,
        FormsModule,
        SharedModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        MatDatepickerModule,
        MatMomentDateModule,
        MatInputModule,
        ReactiveFormsModule,
        DatepickerComponent,
        DateRangePickerComponent,
        DateInputMaskDirective,
    ],
    providers: [
        {
            provide: MAT_DATE_FORMATS, useValue: {
                ...MAT_MOMENT_DATE_FORMATS,
                parse: {
                    dateInput: ['DD-MM-YYYY'],
                },
                display: { ...MAT_MOMENT_DATE_FORMATS.display, dateInput: 'DD-MM-YYYY' },
            }
        },
        { provide: MatDatepickerIntl, useClass: McodMatDatepickerIntl },
    ]
})
export class DatepickerModule {
}

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { InstitutionItemComponent } from './institution-item/institution-item.component';
import { InstitutionComponent } from './institution/institution.component';
import { InstitutionsRoutingModule } from './institutions-routing.module';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { InstitutionItemListViewFiltersComponent } from '@app/pages/institutions/institution-item-list-view-filters/institution-item-list-view-filters.component';
import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        InstitutionsRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser,
            },
        }),
        FormsModule,
        SharedModule,
        DatepickerModule,
        ReactiveFormsModule,
        ClipboardModule,
        InstitutionComponent, InstitutionItemComponent, InstitutionItemListViewFiltersComponent,
    ],
})
export class InstitutionsModule {}

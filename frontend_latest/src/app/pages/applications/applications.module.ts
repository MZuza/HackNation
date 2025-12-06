import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { ApplicationItemComponent } from './application-item/application-item.component';
import { ApplicationComponent } from './application/application.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { ImageUploadComponent } from './image-upload/image-upload.component';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { ApplicationsListViewFiltersComponent } from '@app/pages/applications/application-list-view-filters/applications-list-view-filters.component';
import { SuggestApplicationComponent } from '@app/pages/applications/suggest-application/suggest-application.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ApplicationsRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser,
            },
        }),
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ApplicationComponent,
        ApplicationItemComponent,
        SuggestApplicationComponent,
        ImageUploadComponent,
        ApplicationsListViewFiltersComponent,
    ],
})
export class ApplicationsModule {}

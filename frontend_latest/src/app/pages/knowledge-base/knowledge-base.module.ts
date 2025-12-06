import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { KnowledgeBaseItemDetailsComponent } from './knowledge-base-item-details/knowledge-base-item-details.component';
import { KnowledgeBaseItemPreviewComponent } from './knowledge-base-item-preview/knowledge-base-item-preview.component';
import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { KnowledgeBaseTabsComponent } from './knowledge-base-tabs/knowledge-base-tabs.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        KnowledgeBaseRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        KnowledgeBaseComponent,
        KnowledgeBaseItemPreviewComponent,
        KnowledgeBaseTabsComponent,
        KnowledgeBaseItemDetailsComponent
    ]
})
export class KnowledgeBaseModule {
}

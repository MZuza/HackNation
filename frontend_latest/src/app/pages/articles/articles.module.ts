import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleComponent } from './article/article.component';
import { ArticlesRoutingModule } from './articles-routing.module';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({ parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            } }),
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ArticleItemComponent, ArticleComponent
    ]
})

export class ArticlesModule {}

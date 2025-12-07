import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { NewsComponent } from './news/news.component';
import { SearchComponent } from './search/search.component';
import { ServiceAlertComponent } from './service-alert/service-alert.component';

import { ApplicationsComponent } from '@app/pages/home/applications/applications.component';
import { StatsComponent } from '@app/pages/home/stats/stats.component';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser,
            },
        }),
        SharedModule,
        LocalizeRouterModule,
        HomeComponent,
        StatsComponent,
        CategoriesComponent,
        InstitutionsComponent,
        NewsComponent,
        SearchComponent,
        ServiceAlertComponent,
        ApplicationsComponent,
        FooterComponent,
    ],
    exports: [
        HomeComponent,
        StatsComponent,
        InstitutionsComponent,
        CategoriesComponent,
        NewsComponent,
        SearchComponent,
    ],
})
export class HomeModule {}

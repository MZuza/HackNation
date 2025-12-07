import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SparqlEditorComponent } from '@app/pages/dataset/sparql/editor/sparql-editor-component';
import { SparqlComponent } from '@app/pages/dataset/sparql/sparql.component';
import { SharedModule } from '@app/shared/shared.module';

const ROUTES = [
    {path: '', component: SparqlComponent, data: {breadcrumbs: {label: 'Wyszukiwanie  SPARQL'}}}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        TranslateModule,
        ReactiveFormsModule,
        SharedModule,
        SparqlComponent,
        SparqlEditorComponent
    ],
})
export class SparqlModule {
}

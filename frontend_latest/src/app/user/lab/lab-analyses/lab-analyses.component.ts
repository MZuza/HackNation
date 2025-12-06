import {Component, OnInit} from '@angular/core';
import { LabListComponent } from '../lab-list/lab-list.component';

import { SeoService } from '@app/services/seo.service';

/**
 * Lab Analyses Component
 */
@Component({
    selector: 'app-lab-analyses',
    templateUrl: './lab-analyses.component.html',
    standalone: true,
    imports: [LabListComponent],
})
export class LabAnalysesComponent implements OnInit {

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Analizy', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}

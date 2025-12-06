import { Component, OnInit } from '@angular/core';
import { LabListComponent } from '../lab-list/lab-list.component';

import { SeoService } from '@app/services/seo.service';

/**
 * Lab Researches Component
 */
@Component({
    selector: 'app-lab-researches',
    templateUrl: './lab-researches.component.html',
    standalone: true,
    imports: [LabListComponent],
})
export class LabResearchesComponent implements OnInit {

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Badania', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}

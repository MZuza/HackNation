import { importProvidersFrom, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { Observable, of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { NotificationsService } from '@app/services/notifications.service';
import { SharedModule } from '@app/shared/shared.module';
import { ScheduleTableExportComponent } from '@app/user/schedule/table/components/schedule-table-eport/schedule-table-export.component';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

declare var window;

@Injectable({
    providedIn: 'root'
})
class ScheduleServiceMock {
    getExportUrl(source: 'schedules' | 'user_schedules', id: number | 'current' = 'current', format: 'csv' | 'xlsx',
                 isFullExport: boolean = false): Observable<any> {
        return of('http://example.com/file.csv');
    }
}

describe('Schedule Table Export Component', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                SharedModule,
                TranslateModule.forRoot({
                    parser: {
                        provide: TranslateParser,
                        useClass: TranslateICUParser
                    },
                    defaultLanguage: 'pl',
                    useDefaultLang: true
                }),
              ScheduleTableExportComponent
            ],
            providers: [
              NotificationsService,
              {provide: ScheduleService, useValue: new ScheduleServiceMock()},
              importProvidersFrom(AppTestingModule)
            ]
        }).compileComponents();
    });

    it('should create component', async () => {
        const fixture = TestBed.createComponent(ScheduleTableExportComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent).toBeTruthy();
    });

    it('should open blank window with generated url', async () => {
        const fixture = TestBed.createComponent(ScheduleTableExportComponent);
        const scheduleTableExportComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        const windowOpenMock = jest.spyOn(window, 'open').mockImplementation(() => {
        });
        scheduleTableExportComponent.generateUrl('csv');
        await fixture.whenStable();

        expect(windowOpenMock).toHaveBeenCalledWith('http://example.com/file.csv', '_blank');
    });

});

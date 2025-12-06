import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { AppTestingModule } from '@app/app.testing.module';
import { SharedModule } from '@app/shared/shared.module';
import { ScheduleLinkComponent } from '@app/user/schedule/table/components/schedule-link-component/schedule-link.component';

describe('Schedule Link Component', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ScheduleLinkComponent,
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
            ],
          providers: [importProvidersFrom(AppTestingModule)]
        }).compileComponents();
    });

    it('should create component', async () => {
        const fixture = TestBed.createComponent(ScheduleLinkComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent).toBeTruthy();
    });

});

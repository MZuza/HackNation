import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { SharedModule } from '@app/shared/shared.module';
import { ScheduleButtonComponent } from '@app/user/schedule/table/components/schedule-button-component/schedule-button.component';

describe('Schedule Button Component', () => {
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
              ScheduleButtonComponent
            ]
        }).compileComponents();
    });

    it('should create component', async () => {
        const fixture = TestBed.createComponent(ScheduleButtonComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent).toBeTruthy();
    });

    it('should emit button clicked event when button clicked', async () => {
        const fixture = TestBed.createComponent(ScheduleButtonComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        let buttonClickedEvent;
        deleteConfirmationModalComponent.buttonClicked.subscribe(() => buttonClickedEvent = true);
        fixture.debugElement.query(By.css('button')).triggerEventHandler('click', {target: fixture.debugElement.parent.nativeElement});
        expect(buttonClickedEvent).toBeTruthy();
    });

});

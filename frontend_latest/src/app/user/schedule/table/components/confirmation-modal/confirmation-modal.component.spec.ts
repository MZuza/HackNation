import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { UserService } from '@app/services/user.service';
import { SharedModule } from '@app/shared/shared.module';
import { ConfirmationModalComponent } from '@app/user/schedule/table/components/confirmation-modal/confirmation-modal.component';

describe('Schedule Delete Confirm Modal Component', () => {
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
              ConfirmationModalComponent
            ],
            providers: [UserService]
        }).compileComponents();
    });

    it('should create component', async () => {
        const fixture = TestBed.createComponent(ConfirmationModalComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent).toBeTruthy();
    });


    it('should setup click outside listener', async () => {
        const fixture = TestBed.createComponent(ConfirmationModalComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent['clickOutsideListener']).toBeDefined();
    });


    it('should cleanup click outside listener on destroy', async () => {
        const fixture = TestBed.createComponent(ConfirmationModalComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        const clickOutside = jest.spyOn<any, any>(deleteConfirmationModalComponent, 'clickOutsideListener');
        deleteConfirmationModalComponent.ngOnDestroy();
        expect(clickOutside).toHaveBeenCalled();
    });

    it('should emit close dialog on click outside', async () => {
        const fixture = TestBed.createComponent(ConfirmationModalComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        let closeDialogEvent;
        deleteConfirmationModalComponent.closeDialog.subscribe(() => closeDialogEvent = true);
        fixture.debugElement.parent.triggerEventHandler('click', {target: fixture.debugElement.parent.nativeElement});
        expect(closeDialogEvent).toBeTruthy();
    });

});

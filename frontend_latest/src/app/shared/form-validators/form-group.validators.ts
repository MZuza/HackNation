import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

/**
 * Checks weather both field values are identicaal
 * @param {string} formControlName1
 * @param {string} formControlName2
 * @returns null if valid
 */
export function equalValueValidator(formControlName1: string, formControlName2: string): ValidatorFn {
    return (formGroup: UntypedFormGroup): { [key: string]: any } => {

        const formControl1 = formGroup.controls[formControlName1];
        const formControl2 = formGroup.controls[formControlName2];

        if (!formControl1.touched && !formControl2.dirty) {
            return;
        }

        if (formControl1.value !== formControl2.value) {
            return {notEqualValues: true};
        }

        return null;
    };
}

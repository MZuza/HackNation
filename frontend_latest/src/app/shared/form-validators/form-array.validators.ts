import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';

/**
 * Returned error type
 */
type ValidationError = { [key: string]: boolean } | null;

/**
 * Value in array validator.
 * Checks whether value is in array.
 * @param {string} formControlName
 * @param {string} formArrayName
 * @returns {ValidatorFn} if value in array
 */
export function valueInArrayValidator(formControlName: string, formArrayName: string): ValidatorFn {
    return (formGroup: UntypedFormGroup): { [key: string]: any } => {
        const formControl = formGroup.controls[formControlName];
        const formArray = formGroup.controls[formArrayName];

        if (formControl.pristine || formArray.pristine) {
            return null;
        }

        const formControlValue = formControl.value as string;
        const formArrayValue = formArray.value as string[];

        if (!formControlValue || !formArrayValue) {
            return null;
        }

        const found = formArrayValue.some(item => item === formControlValue);

        if (found) {
            return {'valueInArray': true};
        }

        return null;
    };
}

/**
 * Unique values in array validator.
 * Checks whether array has duplicated values.
 * @param {AbstractControl} control
 * @returns {ValidationError}
 */
export function uniqueValuesInArrayValidator(control: AbstractControl): ValidationError {
    const array = Array.from(control.value);
    const noDuplicatesArray = Array.from(
        new Set(array.map(item => JSON.stringify(item)))).map(item => JSON.parse(item)
    );

    if (array.length !== noDuplicatesArray.length) {
        return {'duplicatesInArray': true};
    }

    return null;
}

/**
 * Checks whether array has only one element
 * @param {AbstractControl} control
 * @returns {ValidationError}
 */
export function oneElementInArrayValidator(control: AbstractControl): ValidationError {
    const array = Array.from(control.value);

    if (array.length > 1) {
        return {'moreThanOneElementInArray': true};
    }

    return null;
}

/**
 * Checks whether array has at least one element
 * @param {AbstractControl} control
 * @returns {ValidationError}
 */
export function atLeastOneCheckboxSelected(control: AbstractControl): ValidationError {
    const isValid = control.value.some(el => !!el);
    return isValid ? null : {'atLeastOneCheckboxSelected': true };
}

/**
 * Regexp helpful pattern to determine type of checkboxes fields
 */
export const radioInputRegex = new RegExp(/^check/);

/**
 * Regexp helpful pattern to determine type of radio buttons fields
 */
export const checkboxInputRegex = new RegExp(/^radio/);


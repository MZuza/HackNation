import { UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StringHelper } from '../helpers/string.helper';

/**
 * Custom form control validators
 */
export class CustomFormControlValidators {

    /**
     * Checks string by using string helpers
     * @param {string} stringHelperFn
     * @param {string} errorName
     * @returns {ValidationErrors}
     */
    static checkString(stringHelperFn: string, errorName: string): ValidatorFn {
        return (control: UntypedFormControl): ValidationErrors => {
            if (control.pristine) {
                return;
            }

            if (!StringHelper[stringHelperFn](control.value)) {
                return {[errorName]: true};
            }

            return null;
        };
    }
}

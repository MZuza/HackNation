import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export function requireOneUrlValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: UntypedFormGroup) {
    let isNotEmpty = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (!!control.value) {
        isNotEmpty++;
      }
    });

    if (isNotEmpty < minRequired) {
      return {
        requireOneToBeNotNull: true,
      };
    }

    return null;
  };
}

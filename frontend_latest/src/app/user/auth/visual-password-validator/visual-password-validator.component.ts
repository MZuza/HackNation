import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UserService } from '@app/services/user.service';
import { CapitalizeFirstLetterPipe } from '@app/shared/pipes/capitalize-first-letter.pipe';

/**
 * Visual Password Validator Component
 * @example
 *  <app-visual-password-validator
        [control]="registrationForm.get('password1')"
        [controlValueMinLength]="passwordMinLength"
        [customValidators]="passwordCustomValidators">
    </app-visual-password-validator>
 */
@Component({
    selector: 'app-visual-password-validator',
    templateUrl: './visual-password-validator.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgClass,
        TranslatePipe,
        CapitalizeFirstLetterPipe,
    ],
})
export class VisualPasswordValidatorComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private userService: UserService) {}

  /**
   * FormControl assosiacted with passwords field
   */
  @Input() control: UntypedFormControl;

  /**
   * Password min length
   */
  passwordMinLength: number;

  /**
   * Custom Validators - string helper name, error name returned by specified validator
   */
  customValidators: string[][];

  /**
   * Initializes validation indicators
   */
  ngOnInit() {
    this.passwordMinLength = this.userService.passwordMinLength;
    this.customValidators = this.userService.passwordCustomValidators;
  }
}

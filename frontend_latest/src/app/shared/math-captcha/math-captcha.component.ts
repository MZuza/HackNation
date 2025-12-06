import { LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControlDirective,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';

/**
 * Math Captcha Component
 */
@Component({
    selector: 'app-math-captcha',
    templateUrl: './math-captcha.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MathCaptchaComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MathCaptchaComponent),
            multi: true,
        },
    ],
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgClass,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class MathCaptchaComponent implements OnInit, ControlValueAccessor {
  /**
   * Reference to the input with formControl directive
   */
  @ViewChild(FormControlDirective, { static: true }) formControlDirective: FormControlDirective;

  /**
   * Related formcontrol
   */
  @Input() formControl: UntypedFormControl;

  /**
   * Related formcontrol name
   */
  @Input() formControlName: string;

  /**
   * Equation numbers count
   */
  @Input() numbersCount = 2;

  /**
   * Equation result
   */
  equationResult: number;

  /**
   * Label - equation as a text
   */
  equationLabel: string;

  /**
   * Gets formcontrol
   */
  get control() {
    return this.formControl || this.controlContainer.control.get(this.formControlName);
  }

  /**
   * @ignore
   */
  constructor(private controlContainer: ControlContainer) {}

  /**
   * Writes a new value to the element (input)
   */
  writeValue() {}

  /**
   * Registers a callback function that is called when the control's value changes in the UI
   * @param {any} fn
   */
  registerOnChange(fn: any) {
    this.formControlDirective.valueAccessor.registerOnChange(fn);
  }

  /**
   * Registers a callback function that is called by the forms API on initialization to update the form model on blur
   * @param {any} fn
   */
  registerOnTouched(fn: any) {
    this.formControlDirective.valueAccessor.registerOnTouched(fn);
  }

  /**
   * Validates captcha control against correct value
   * @param {AbstractControl} control
   * @returns {ValidationErrors}
   */
  validate(control: AbstractControl): ValidationErrors | null {
    if (+control.value !== this.equationResult) {
      return { invalidNumber: true };
    }

    return null;
  }

  /**
   * Initializes captcha
   */
  ngOnInit() {
    this.generateNumbers();
  }

  /**
   * Generates captcha eqation numbers
   */
  private generateNumbers() {
    const numbersArray = [];

    for (let i = 0; i < this.numbersCount; i++) {
      numbersArray.push(Math.floor(Math.random() * 10) + 1);
    }

    this.equationResult = numbersArray.reduce((a, b) => a + b, 0);
    this.equationLabel = numbersArray.join(' + ');
  }
}

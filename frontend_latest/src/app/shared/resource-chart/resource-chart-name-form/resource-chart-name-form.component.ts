import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { toggleVertically } from '@app/animations/toggle-vertically';

@Component({
  selector: 'app-resource-chart-name-form',
  templateUrl: './resource-chart-name-form.component.html',
  animations: [toggleVertically],
})
export class ResourceChartNameFormComponent {
  /**
   * Chart name
   */
  @Input() name = '';

  /**
   * Form has been saved event
   */
  @Output() formSaved = new EventEmitter<string>();

  /**
   * Title min chars
   */
  nameMinChars = 3;

  /**
   * Submits the form
   * @param {NgForm} form
   */
  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return false;
    }

    this.formSaved.emit(form.value.name);
    form.reset();
  }
}

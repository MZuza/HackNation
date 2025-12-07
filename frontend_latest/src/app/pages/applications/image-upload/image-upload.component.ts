import { LowerCasePipe, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { FileSizeComponent } from '@app/shared/file-size/file-size.component';
import { StringHelper } from '@app/shared/helpers/string.helper';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageUploadComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ImageUploadComponent),
            multi: true,
        },
    ],
    animations: [toggleVertically],
    standalone: true,
    imports: [
        NgIf,
        FileSizeComponent,
        LowerCasePipe,
        TranslatePipe,
    ],
})
export class ImageUploadComponent implements OnInit, ControlValueAccessor {
  /**
   * File input reference
   */
  @ViewChild('imageInput') imageInput: ElementRef;

  /**
   * Label translation key
   */
  @Input() labelTranslationKey = 'File.Self';

  /**
   * Text next to label for hint
   */
  @Input() labelTranslationKeyHint = '';

  /**
   * Related formcontrol
   */
  @Input() formControl: UntypedFormControl;

  /**
   * Related formcontrol name
   */
  @Input() formControlName: string;

  /**
   * Maximum image height in pixels
   */
  @Input() maxHeight = 200;

  /**
   * Maximum image width in pixels
   */
  @Input() maxWidth = 200;

  /**
   * Uploaded file (any type)
   */
  uploadedFile: File;

  /**
   * Handles change event of the file input
   */
  onChange: Function;

  /**
   * Uploaded image preview
   */
  uploadedImagePreview: string | ArrayBuffer;

  /**
   * Accepted mime types
   */
  acceptedMimeTypes = ['image/jpeg', 'image/gif', 'image/png'];

  /**
   * Related formcontrol
   */
  control: AbstractControl;

  /**
   * Unique id
   */
  uniqueId = StringHelper.generateRandomHex();

  /**
   * Event emitted when image is set
   */
  @Output() imageDataChanged = new EventEmitter<string>();

  /**
   * Initalizaes acces to the related form control
   */
  ngOnInit() {
    if (this.formControlName) {
      this.control = this.controlContainer.control.get(this.formControlName);
    } else {
      this.control = this.formControl;
    }
  }

  /**
   * Listens on change of the file input
   */
  @HostListener('change', ['$event.target.files']) onImageInputChange(files: FileList) {
    this.uploadedFile = files && files.item(0);
    this.onChange(this.uploadedFile);

    if (this.hasCorrectType(this.uploadedFile.type)) {
      this.generateImagePreview();
    } else {
      this.uploadedImagePreview = null;
    }
  }

  /**
   * Generates image preview
   */
  generateImagePreview() {
    if (!this.uploadedFile) {
      return;
    }

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onloadend = () => {
      this.uploadedImagePreview = reader.result;
      this.imageDataChanged.emit(reader.result as string);
    };
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
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that is called by the forms API on initialization to update the form model on blur
   * @param {any} fn
   */
  registerOnTouched(fn: Function) {}

  /**
   * Validates control against correct file type
   * @param {AbstractControl} control
   * @returns {ValidationErrors}
   */
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.pristine) {
      return;
    }

    if (!this.hasCorrectType(control.value.type)) {
      return { invalidImageType: true };
    }

    return null;
  }

  /**
   * Removes already uploaded image and clears related form data
   */
  onImageRemove() {
    this.uploadedFile = null;
    this.uploadedImagePreview = null;

    (<HTMLInputElement>this.imageInput.nativeElement).value = '';
    this.control.reset();
    this.imageDataChanged.emit(null);
  }

  /**
   * Determines whether uploaded file has correct type
   * @param {string} type
   * @returns {boolean}
   */
  hasCorrectType(type: string): boolean {
    return this.acceptedMimeTypes.indexOf(type) !== -1;
  }
}

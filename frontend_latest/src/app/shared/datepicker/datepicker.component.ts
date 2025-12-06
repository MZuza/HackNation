import { NgIf, NgStyle } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import moment, { Moment } from 'moment';
import { StringHelper } from '../helpers/string.helper';
import { DateInputMaskDirective } from './date-input-mask.directive';

/**
 * Datepicker component
 */
@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgStyle, FormsModule, MatDatepickerInput, DateInputMaskDirective, ReactiveFormsModule, MatDatepicker, NgIf, TranslatePipe]
})
export class DatepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
    /**
     * date value
     */
    dateValue: Date = null;

    /**
     * max date possible value
     */
    maxDateValue: Date = null;

    /**
     * min date possible value
     */
    minDateValue: Date = null;
    /**
     * shows popup panel
     */
    @Input() isPanelVisible = true;
    /**
     * is required attribute
     */
    @Input() isRequired = true;
    /**
     * is readonly attribute
     */
    @Input() isReadonly = false;
    /**
     * is disabled attribute
     */
    @Input() isDisabled = false;
    /**
     * placeholder to translate
     */
    @Input() placeholderTranslationKey = 'Filters.Value';
    /**
     * name attribute
     */
    @Input() name: string;
    /**
     * label attribute
     */
    @Input() label = '';

    @Input()
    isSmall: boolean = true;

    @Input()
    isLabelVisible: boolean = false;

    @Input()
    width: number;
    /**
     * unique id for datepicker
     */
    generatedId = `datepicker-${StringHelper.generateRandomHex()}`;
    /**
     * date form control
     */
    dateFormCtrl: UntypedFormControl;
    /**
     * emits when date changed
     */
    @Output() dateChange = new EventEmitter<Date | null>();

    /**
     * Input mask config
     * @type {{showMask: boolean, placeholderChar: string, guide: boolean, mask: (RegExp | string)[]}}
     */
    mask: { showMask: boolean; placeholderChar: string; guide: boolean; mask: (RegExp | string)[]; } = {
        mask: [
            new RegExp('\\d'),
            new RegExp('\\d'),
            '/',
            new RegExp('\\d'),
            new RegExp('\\d'),
            '/',
            new RegExp('\\d'),
            new RegExp('\\d'),
            new RegExp('\\d'),
            new RegExp('\\d')
        ],
        showMask: false,
        guide: false,
        placeholderChar: '_'
    };

    constructor(private readonly adapter: DateAdapter<any>,
                private readonly translateService: TranslateService,
                private readonly changeDetectorRef: ChangeDetectorRef) {
    }

    /**
     * sets date value when string or Date
     * @param {Date | string} date
     */
    @Input() set date(date: Date | string) {
        this.dateValue = date ? new Date(date) : null;
        this.dateFormCtrl = new UntypedFormControl({value: this.dateValue, disabled: this.isDisabled});
    }

    /**
     * sets max date value when string or Date
     * @param {Date | string} date
     */
    @Input() set maxDate(date: Date | string) {
        this.maxDateValue = date ? new Date(date) : null;
    }

    /**
     * sets min date value when string or Date
     * @param {Date | string} date
     */
    @Input() set minDate(date: Date | string) {
        this.minDateValue = date ? new Date(date) : null;
    }

    /**
     * Writes input value
     * @param obj
     */
    writeValue(obj: any): void {
        this.date = obj;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Registers on change callback
     * @param fn
     */
    registerOnChange(fn: any): void {
        this.onValueChange = fn;
    }

    /**
     * Register on touch callback
     * @param fn
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Setups locale and form control
     */
    ngOnInit() {
        this.adapter.setLocale(this.translateService.currentLang);
        this.dateFormCtrl = new UntypedFormControl({value: this.dateValue, disabled: this.isDisabled});
    }

    /**
     * Updates input disable state on changes
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!!changes.isDisabled && !changes.isDisabled.firstChange) {
            if (changes.isDisabled.currentValue) {
                this.dateFormCtrl.disable();
                return;
            }
            this.dateFormCtrl.enable();
        }
    }

    /**
     * invoked when date input changed
     * @param {Date} date
     */
    change(date: MatDatepickerInputEvent<Moment>) {
        this.onTouched();
        if (date && date.value) {
            if (this.dateValue && moment(this.dateValue).isSame(date.value, 'day')) {
                return;
            }
            this.dateChange.next(date.value.toDate());
            this.onValueChange(date.value.toDate());
        } else {
            this.dateChange.next(null);
            this.onValueChange(null);
        }
    }

    /**
     * Input value change callback
     * @param value
     */
    private onValueChange: (value: any) => void = (value) => {
    }

    /**
     * Input touched callback
     */
    private onTouched: () => void = () => {
    }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Schedule Status Switcher Component
 */
@Component({
    selector: 'app-schedule-status-switcher',
    templateUrl: './schedule-status-switcher.component.html',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
})
export class ScheduleStatusSwitcherComponent implements OnInit, OnDestroy {

    /**
     * Completed status
     * @type {boolean}
     */
    @Input()
    completed: boolean;

    /**
     * Determines if form is disabled
     * @type {boolean}
     */
    @Input()
    disabled: boolean;

    /**
     * Switcher text
     * @type {string}
     */
    @Input()
    text = 'oznacz harmonogram jako gotowy';

    /**
     * Emitted when schedule status changed
     * @type {EventEmitter<boolean>}
     */
    @Output()
    scheduleStatusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Completion status Form Control
     * @type {FormControl}
     */
    completedFormControl: UntypedFormControl;

    /**
     * Subject for cleanup purposes
     * @type {Subject<void>}
     */
    private cleanup$: Subject<void> = new Subject<void>();

    /**
     * Subscribes for completion changes and emits event
     */
    ngOnInit(): void {
        this.completedFormControl = new UntypedFormControl({value: this.completed, disabled: this.disabled});
        this.completedFormControl.valueChanges
            .pipe(takeUntil(this.cleanup$))
            .subscribe(value => this.scheduleStatusChanged.emit(value));
    }

    /**
     * Cleanup subscriptions
     */
    ngOnDestroy() {
        this.cleanup$.next();
    }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Feedback } from '@app/shared/feedback/Feedback';

/**
 * Feedback component
 */
@Component({
    selector: 'app-feedback-component',
    templateUrl: './feedback.component.html',
    standalone: true
})
export class FeedbackComponent {
    /**
     * Pluses count
     */
    @Input()
    plusesCount: number;

    /**
     * Minuses count
     */
    @Input()
    minusesCount: number;

    /**
     * Is plus button selected
     */
    @Input()
    isPlusButtonSelected: boolean;

    /**
     * Is minus button selected
     */
    @Input()
    isMinusButtonSelected: boolean;

    /**
     * Determines if feedback can be edited
     */
    @Input()
    isEditable: boolean;

    /**
     * Emitted when user click a button
     * @type {EventEmitter<Feedback>}
     */
    @Output()
    changeCount: EventEmitter<Feedback> = new EventEmitter<Feedback>();

    /**
     * Feedback enum reference
     * @type {Feedback}
     */
    feedback: typeof Feedback = Feedback;

    /**
     * Emits event when user click a button
     * @param action
     */
    onClicked(action: Feedback): void {
        this.changeCount.emit(action);
    }
}

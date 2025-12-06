import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { ScheduleItemComment } from '@app/user/schedule/components/schedule-comments/schedule-item-comment';
import { SchedulePlanningService } from '@app/user/schedule/tabs/planning/schedule-planning.service';

@Component({
    selector: 'app-schedule-comments-form',
    templateUrl: './schedule-comments-form.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class ScheduleCommentsFormComponent implements OnInit, AfterViewInit, OnDestroy {

    /**
     * Comment field (textarea)
     */
    @ViewChild('commentField', {static: false}) commentField: ElementRef;

    /**
     * Id of related schedule item
     */
    @Input() scheduleItemId: string;

    /**
     * Comment to edit
     */
    @Input() commentToEdit: ScheduleItemComment;

    /**
     * Max number of characters in the comment
     */
    @Input() minCommentLength = 1;

    /**
     * Max number of characters in the comment
     */
    @Input() maxCommentLength = 3000;

    /**
     * Emits comment after changes
     */
    @Output() entrySaved = new EventEmitter<ScheduleItemComment | null>();

    /**
     * Emits cancellation event
     */
    @Output() editCanceled = new EventEmitter<null>();

    /**
     * Comment form
     */
    commentForm: UntypedFormGroup;

    /**
     * Determines whether is edit mode
     */
    isEditMode: boolean;

    /**
     * Timeout cleanup
     * @type {any}
     */
    private focusTimeout: any;

    /**
     * @ignore
     */
    constructor(private schedulePlanningService: SchedulePlanningService,
                private renderer: Renderer2) {
    }

    /**
     * Inits form.
     * Sets form mode.
     */
    ngOnInit(): void {
        this.isEditMode = this.commentToEdit?.attributes.text ? true : false;
        this.initForm();
    }

    /**
     * Sets focus on active textarea and adjusts its heigh to the text inside
     */
    ngAfterViewInit(): void {
        if (!this.isEditMode) {
            return;
        }

        this.focusTimeout = setTimeout(() => {
            const textarea = (<HTMLTextAreaElement>this.commentField.nativeElement);
            textarea.focus();
            const contentHeight = textarea.scrollHeight + 5;
            this.renderer.setStyle(textarea, 'height', contentHeight + 'px');
        });
    }

    /**
     * Inits form and sets validators
     */
    initForm(): void {
        this.commentForm = new UntypedFormGroup({
            'comment': new UntypedFormControl(this.isEditMode ? this.commentToEdit.attributes.text : null, [
                Validators.required,
                Validators.minLength(this.minCommentLength),
                Validators.maxLength(this.maxCommentLength)
            ])
        });


    }

    /**
     * Saves entry
     */
    onFormSubmit(): void  {
        if (this.commentForm.invalid) {
            return;
        }

        const payload = `{
            "data": {
                "type": "comment",
                "attributes": {
                    "text": ${JSON.stringify(this.commentForm.value.comment)}
                }
            }
        }`;

        if (this.isEditMode) {
            this.schedulePlanningService
                .saveComment(this.scheduleItemId, JSON.parse(payload), this.commentToEdit.id)
                .subscribe(savedComment => {
                    this.resetForm();
                    this.entrySaved.emit(savedComment);
                }
            );
        } else {
            this.schedulePlanningService
                .saveComment(this.scheduleItemId, JSON.parse(payload))
                .subscribe(() => {
                    this.resetForm();
                    this.entrySaved.emit();
                }
            );
        }
    }

    /**
     * Emits cancellation event
     */
    onEditCancel() {
        this.editCanceled.emit();
    }

    /**
     * Resets form
     */
    private resetForm() {
        this.commentToEdit = null;
        this.commentForm.reset();
    }

    /**
     * Clears focus timeout
     */
    ngOnDestroy() {
        clearTimeout(this.focusTimeout);
    }
}

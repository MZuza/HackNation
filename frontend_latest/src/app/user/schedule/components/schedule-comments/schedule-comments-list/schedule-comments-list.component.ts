import { AsyncPipe, NgFor, NgIf, SlicePipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ScheduleCommentsFormComponent } from '../schedule-comments-form/schedule-comments-form.component';

import { toggleVertically } from '@app/animations';
import { UserStateService } from '@app/services/user-state.service';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { ScheduleItemComment } from '@app/user/schedule/components/schedule-comments/schedule-item-comment';

/**
 * Schedule Comments List Component
 */
@Component({
    selector: 'app-schedule-comments-list',
    templateUrl: './schedule-comments-list.component.html',
    animations: [
        toggleVertically
    ],
    standalone: true,
    imports: [NgFor, NgIf, ScheduleCommentsFormComponent, AsyncPipe, SlicePipe, TitleCasePipe, TranslateDateFormatPipe]
})
export class ScheduleCommentsListComponent implements OnInit {

    /**
     * Input  of schedule comments list component
     */
    @Input() scheduleItemId: string;

    /**
     * List of comments
     */
    @Input() comments: ScheduleItemComment[];

    /**
     * Comment to edit
     */
    commentToEdit: ScheduleItemComment;

    /**
     * Current user email
     */
    currentUserEmail: string;

    /**
     * @ignore
     */
    constructor(private userStateService: UserStateService) {}

    /**
     * Initializes current user's email
     */
    ngOnInit() {
        this.userStateService.getCurrentUser().subscribe(currentUser => this.currentUserEmail = currentUser.attributes.email);
    }

    /**
     * Updates selected comment
     * @param {ScheduleItemComment} comment
     */
    onCommentUpdate(comment: ScheduleItemComment) {
        const index = this.comments.findIndex(item => item.id === comment.id);
        this.comments[index] = comment;
        this.commentToEdit = null;
    }

    /**
     * Clears selected comment
     */
    onEditCancel() {
        this.commentToEdit = null;
    }
}

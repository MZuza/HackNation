import { Component, Input, OnInit } from '@angular/core';
import { ScheduleCommentsFormComponent } from './schedule-comments-form/schedule-comments-form.component';
import { ScheduleCommentsListComponent } from './schedule-comments-list/schedule-comments-list.component';

import { ScheduleItemComment } from '@app/user/schedule/components/schedule-comments/schedule-item-comment';
import { SchedulePlanningService } from '@app/user/schedule/tabs/planning/schedule-planning.service';

@Component({
    selector: 'app-schedule-comments',
    templateUrl: './schedule-comments.component.html',
    standalone: true,
    imports: [ScheduleCommentsListComponent, ScheduleCommentsFormComponent],
})
export class ScheduleCommentsComponent implements OnInit {

    /**
     * Schedule item id
     */
    @Input() scheduleItemId: string;

    /**
     * List of comments
     */
    comments: ScheduleItemComment[];

    /**
     * @ignore
     */
    constructor(private schedulePlanningService: SchedulePlanningService) {}

    /**
     * Initializes list of comments
     */
    ngOnInit() {
        this.getComments();
    }

    /**
     * Gets list of comments
     */
    getComments() {
        this.schedulePlanningService.getScheduleItemComments(this.scheduleItemId).subscribe(comments => this.comments = comments);
    }
}

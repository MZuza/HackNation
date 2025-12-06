import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataProposalService } from '@app/services/data-proposal.service';
import { Feedback } from '@app/shared/feedback/Feedback';
import { FeedbackComponent } from '@app/shared/feedback/feedback.component';
import { DataProposalDetails } from '@app/user/data-proposal/details/DataProposalDetails';
import { FeedbackCounters } from '@app/user/data-proposal/details/FeedbackCounters';

/**
 * Data Proposal List Item Component
 */
@Component({
    selector: 'app-data-proposal-details',
    templateUrl: './data-proposal-details.component.html',
    providers: [{ provide: DataProposalService }],
    standalone: true,
    imports: [
        NgIf,
        FeedbackComponent,
        TranslatePipe,
    ],
})
export class DataProposalDetailsComponent implements OnInit, OnDestroy {
  /**
   * Data proposal details
   */
  data: DataProposalDetails;

  /**
   * Determines if likes edit is allowed
   */
  isLikeEnabled: boolean;

  private destroy$: Subject<void> = new Subject<void>();

  /**
   * @ignore
   */
  constructor(private readonly dataProposalService: DataProposalService, private readonly activatedRoute: ActivatedRoute) {}

  /**
   * Gets required data
   */
  ngOnInit(): void {
    this.isLikeEnabled = this.activatedRoute.snapshot.parent.routeConfig.path === 'active';
    this.dataProposalService
      .getOne(this.activatedRoute.snapshot.params.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
      });
  }

  /**
   * Cleans observables
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

  /**
   * Changes data proposal rating
   * @param action
   */
  changeRating(action: Feedback): void {
    this.isLikeEnabled = false;
    if (action === this.data.attributes.my_feedback) {
      this.handleRemoveRating(action);
      return;
    }
    this.handleUpdateRating(action);
  }

  /**
   * Handles rating update
   * @param action
   */
  private handleUpdateRating(action: Feedback): void {
    this.dataProposalService
      .updateRating(action, this.data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.data = {
          ...this.data,
          attributes: {
            ...this.data.attributes,
            my_feedback: action,
            feedback_counters: this.calculateFeedbackCount(action),
          },
        };
        this.isLikeEnabled = true;
      });
  }

  /**
   * Handles remove rating
   * @param action
   */
  private handleRemoveRating(action: Feedback): void {
    this.dataProposalService
      .removeRating(action, this.data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.data = {
          ...this.data,
          attributes: {
            ...this.data.attributes,
            my_feedback: undefined,
            feedback_counters: this.calculateFeedbackCount(action, true),
          },
        };
        this.isLikeEnabled = true;
      });
  }

  /**
   * Calculates feedback count
   * @param action
   * @param isRemoveRating
   * @returns {FeedbackCounters}
   */
  private calculateFeedbackCount(action: Feedback, isRemoveRating: boolean = false): FeedbackCounters {
    const feedbackCounters: FeedbackCounters = { ...this.data.attributes.feedback_counters };

    if (!isRemoveRating) {
      feedbackCounters[action] = feedbackCounters[action] + 1;
      this.decreasePreviouslySelectedRatingCount(feedbackCounters);
    } else {
      feedbackCounters[action] = feedbackCounters[action] - 1;
    }
    return feedbackCounters;
  }

  /**
   * Decreases rating count for previously selected rating
   * @param feedbackCounters
   */
  private decreasePreviouslySelectedRatingCount(feedbackCounters: FeedbackCounters): void {
    if (this.data.attributes.my_feedback) {
      feedbackCounters[this.data.attributes.my_feedback]--;
    }
  }
}

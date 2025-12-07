import { Feedback } from '@app/shared/feedback/Feedback';
import { FeedbackCounters } from '@app/user/data-proposal/details/FeedbackCounters';

export interface DataProposalDetails {
  id: number;
  attributes: {
    title: string;
    notes: string;
    organization_name: string;
    potential_possibilities: string;
    data_link: string;
    feedback_counters: FeedbackCounters;
    my_feedback?: Feedback;
  };
}

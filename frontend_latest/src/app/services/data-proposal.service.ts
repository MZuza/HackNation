import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfig, ApiResponse } from '@app/services/api';
import { Feedback } from '@app/shared/feedback/Feedback';
import { UserDashboardListViewService } from '@app/user/list-view/user-dashboard-list-view.service';

/**
 * Services that handles communication with DataProposal API `\/submissions/accepted`
 */
@Injectable()
export class DataProposalService extends UserDashboardListViewService {

    /**
     * Sends update rating request to API
     * @param action
     * @param id
     * @returns {Observable<ApiResponse>}
     */
    updateRating(action: Feedback, id: number): Observable<any> {
        return this.post(ApiConfig.dataProposal + '/' + id + ApiConfig.dataProposalFeedback, {
            data: {
                type: 'feedback', attributes: {opinion: action}
            }
        })
            .pipe(map(response => response['data']));
    }

    /**
     * Removes selected rating
     * @param action
     * @param id
     * @returns {Observable<any>}
     */
    removeRating(action: Feedback, id: number): Observable<void> {
        return this.delete(ApiConfig.dataProposal + '/' + id + ApiConfig.dataProposalFeedback);
    }
}

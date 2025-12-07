import {LabListItemReport} from '@app/user/lab/lab-list/LabListItemReport';

export interface LabListItem {
    id: number;
    type: string;
    attributes: {
        title: string,
        notes: string,
        execution_date: string,
        reports: Array<LabListItemReport>,
    };
}

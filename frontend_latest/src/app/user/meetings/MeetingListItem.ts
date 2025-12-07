import { MeetingListItemMaterial } from '@app/user/meetings/MeetingListItemMaterial';

export interface MeetingListItem {
    id: number;
    attributes: {
        start_date: string,
        start_time: string,
        end_time: string,
        materials: Array<MeetingListItemMaterial>
        description: string,
        state: string,
        state_name: string,
        title: string,
        venue: string
    };
}


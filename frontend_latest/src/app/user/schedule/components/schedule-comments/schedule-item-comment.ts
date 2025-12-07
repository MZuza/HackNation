export interface ScheduleItemComment {
    id: string;
    attributes: {
        author: string;
        created: string;
        modified?: string;
        text: string;
    }
}
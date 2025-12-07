export interface ScheduleNotification {
  description: string;
  id: number;
  timestamp: string;
  unread: boolean;
  url: string;
  verb: string;
  schedule_state: string;
  schedule_id: string;
  user_schedule_id: string;
  user_schedule_item_id: string;
}

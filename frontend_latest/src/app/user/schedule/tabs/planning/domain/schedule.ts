import { ScheduleTableDataSource } from '@app/user/schedule/table/domain/ScheduleTableDataSource';

export interface Schedule {
  id: number;
  data: Array<ScheduleTableDataSource>;
  planningEndDate: string;
  newPlanningEndDate: string;
  startDate: string;
  link: string;
  periodName: string;
  state: string;
  totalAgentsCount?: number;
  isBlocked?: boolean;
}

export interface UserSchedule extends Schedule {
  completed?: boolean;
  representativeEmail?: string;
  userScheduleId?: number;
  isReady?: boolean;
}

export interface PlanningFormBlueprint {
  id?: string;
  user_id?: string;
  agent_id?: string;
  user_schedule_id?: string;
  email?: string;
  institution: string;
  institution_unit?: string;
  dataset_title: string;
  format: string;
  is_new: boolean;
  is_ready: boolean;
  is_openness_score_increased?: boolean;
  is_quality_improved?: boolean;
  description?: string;
  is_schedule_blocked: boolean;
  is_user_schedule_blocked: boolean;
}

export interface ScheduleSettings {
  schedule_id: string;
  period_name: string;
  end_date: string;
  new_end_date: string;
  link: string;
}

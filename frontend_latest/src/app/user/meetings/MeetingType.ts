import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

export class MeetingType extends UserDashboardListViewFilterType {
  static PLANNED = new MeetingType('planned', 'ProxiesMeetings.Planned');
  static FINISHED = new MeetingType('finished', 'ProxiesMeetings.Finished');

  public static getTypes(): Array<MeetingType> {
    return [MeetingType.PLANNED, MeetingType.FINISHED];
  }
}

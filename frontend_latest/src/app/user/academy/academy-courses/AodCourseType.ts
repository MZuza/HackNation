import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

export class AodCourseType extends UserDashboardListViewFilterType {
  static PLANNED = new AodCourseType('planned', 'Aod.Planned');
  static CURRENT = new AodCourseType('current', 'Aod.Current');
  static FINISHED = new AodCourseType('finished', 'Aod.Finished');

  static getTypes(): Array<AodCourseType> {
    return [AodCourseType.PLANNED, AodCourseType.CURRENT, AodCourseType.FINISHED];
  }
}

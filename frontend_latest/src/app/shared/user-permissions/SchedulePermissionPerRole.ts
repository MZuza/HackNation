/* tslint:disable:max-line-length */
import { Role } from '@app/shared/user-permissions/Role';

export class SchedulePermissionPerRole {
  /**
   * User has access to view any schedule related data
   */
  static HAS_ACCESS = [Role.ADMIN, Role.REPRESENTATIVE];

  //region Shared
  /*
  User is allowed to change settings
  */
  static CHANGE_SETTINGS = [Role.ADMIN];

  /*
     User is allowed to send notification
     */
  static SEND_NOTIFICATION = [Role.ADMIN];
  //endregion

  //region Dashboard
  /*
     User is allowed to browse all schedules on dashboard
     */
  static DASHBOARD_BROWSE_ALL_SCHEDULES = [Role.ADMIN];

  /*
     User is allowed to browse notifications on dashboard
     */
  static DASHBOARD_BROWSE_NOTIFICATIONS = [Role.ADMIN, Role.REPRESENTATIVE];
  //endregion

  //region Planning
  /*
     User is allowed to browse current schedule on planning
     */
  static PLANNING_BROWSE_CURRENT = [Role.REPRESENTATIVE];

  /*
     User is allowed to add entry on planning
     */
  static PLANNING_ADD_ENTRY = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to edit entry on planning
     */
  static PLANNING_EDIT_ENTRY = [Role.REPRESENTATIVE];

  /*
     User is allowed to delete entry on planning
     */
  static PLANNING_DELETE_ENTRY = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to add comment on planning
     */
  static PLANNING_ADD_COMMENT = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to export data on planning
     */
  static PLANNING_EXPORT_DATA = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to mark schedule as completed on planning
     */
  static PLANNING_MARK_AS_COMPLETED = [Role.REPRESENTATIVE];

  /*
     User is allowed to start new period on planning
     */
  static PLANNING_START_NEW_PERIOD = [Role.ADMIN];

  /*
     User is allowed to export full data on planning
     */
  static PLANNING_EXPORT_FULL_DATA = [Role.ADMIN];

  /*
     User is allowed to browse all schedules on planning
     */
  static PLANNING_BROWSE_ALL = [Role.ADMIN];

  /*
     User is allowed to find similar on planning
     */
  static PLANNING_FIND_SIMILAR = [Role.ADMIN];

  /*
     User is allowed to add recommendations on planning
     */
  static PLANNING_ADD_RECOMMENDATIONS = [Role.ADMIN];
  //endregion

  //region In Progress
  /*
    User is allowed to browse periods on in progress
    */
  static IN_PROGRESS_BROWSE_PERIODS = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to add entry on in progress
     */
  static IN_PROGRESS_REALIZE_OWN = [Role.REPRESENTATIVE];

  /*
     User is allowed to edit entry on in progress
     */
  static IN_PROGRESS_REALIZE_ENTRY = [Role.REPRESENTATIVE];

  /*
     User is allowed to browse schedules on in progress
     */
  static IN_PROGRESS_BROWSE_SCHEDULES = [Role.ADMIN];

  /*
     User is allowed to move schedule on in progress
     */
  static IN_PROGRESS_MOVE_TO_ARCHIVE = [Role.ADMIN];

  /*
     User is allowed to browse representatives schedules on in progress
     */
  static IN_PROGRESS_BROWSE_REPRESENTATIVES_SCHEDULES = [Role.ADMIN];

  /*
     User is allowed to add entry on in progress
     */
  static IN_PROGRESS_ADD_ENTRY = [Role.ADMIN];

  /*
     User is allowed to remove entry on in progress
     */
  static IN_PROGRESS_REMOVE_ENTRY = [Role.ADMIN];

  //endregion

  //region Archive
  /*
    User is allowed to browse periods on archive
    */
  static ARCHIVE_BROWSE_PERIODS = [Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to realize own schedule on archive
     */
  static ARCHIVE_REALIZE_OWN = [Role.REPRESENTATIVE];

  /*
     User is allowed to browse entry on archive
     */
  static ARCHIVE_BROWSE_ENTRY = [Role.REPRESENTATIVE];

  /*
     User is allowed to browse schedules on archive
     */
  static ARCHIVE_BROWSE_SCHEDULES = [Role.ADMIN];

  /*
     User is allowed to browse representative schedule on archive
     */
  static ARCHIVE_BROWSE_REPRESENTATIVE_SCHEDULE = [Role.ADMIN];

  /*
     User is allowed to move schedule to in progress on archive
     */
  static ARCHIVE_MOVE_TO_IN_PROGRESS = [Role.ADMIN];

  /*
     User is allowed to edit entry on archive
     */
  static ARCHIVE_EDIT_ENTRY = [Role.ADMIN];
  //endregion
}

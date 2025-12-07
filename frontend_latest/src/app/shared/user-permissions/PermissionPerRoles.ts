/* tslint:disable:max-line-length */
import { Role } from '@app/shared/user-permissions/Role';
import { SchedulePermissionPerRole } from '@app/shared/user-permissions/SchedulePermissionPerRole';

export class PermissionPerRoles {
  /*
     User is allowed to browse dashboard
    */
  static readonly BROWSE_DASHBOARD = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to browse lod
    */
  static readonly BROWSE_LOD = [Role.LOGGED_IN, Role.OFFICIAL, Role.EDITOR, Role.ADMIN_AOD, Role.ADMIN_LOD, Role.PORTAL_ADMIN, Role.ADMIN];

  /*
     User is allowed to browse aod
    */
  static readonly BROWSE_AOD = [
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
    Role.REPRESENTATIVE,
  ];

  /*
      User is allowed to browse forum
    */
  static readonly BROWSE_FORUM = [Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to manage observers
    */
  static readonly MANAGE_OBSERVERS = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to change password
    */
  static readonly CHANGE_PASSWORD = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to go to admin panel
    */
  static readonly GO_TO_ADMIN_PANEL = [Role.EDITOR, Role.ADMIN_AOD, Role.ADMIN_LOD, Role.PORTAL_ADMIN, Role.ADMIN];

  /*
     User is allowed to set notification as read
    */
  static readonly SET_NOTIFICATION_AS_READ = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to view search history
    */
  static readonly VIEW_SEARCH_RESULT_HISTORY = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to manage email notifications
    */
  static readonly MANAGE_EMAIL_NOTIFICATIONS = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to manage observers of datasets
    */
  static readonly MANAGE_DATASET_OBSERVERS = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to manage observers of search result
    */
  static readonly MANAGE_SEARCH_RESULT_OBSERVERS = [
    Role.LOGGED_IN,
    Role.OFFICIAL,
    Role.EDITOR,
    Role.ADMIN_AOD,
    Role.ADMIN_LOD,
    Role.PORTAL_ADMIN,
    Role.ADMIN,
  ];

  /*
     User is allowed to browse new data proposal
    */
  static readonly BROWSE_NEW_DATA_PROPOSAL = [Role.EDITOR, Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
     User is allowed to browse inactive data proposal
    */
  static readonly BROWSE_INACTIVE_DATA_PROPOSAL = [Role.EDITOR, Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
       User is allowed to rate data proposal
    */
  static readonly RATE_DATA_PROPOSAL = [Role.EDITOR, Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
    User is allowed to browse meetings
 */
  static readonly BROWSE_MEETINGS = [Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
    User is allowed to filter meetings
 */
  static readonly FILTER_MEETINGS = [Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
    User is allowed to download meetings attachments
 */
  static readonly DOWNLOAD_MEETINGS_ATTACHMENTS = [Role.PORTAL_ADMIN, Role.ADMIN, Role.REPRESENTATIVE];

  /*
    User is allowed to preview unpublished application
 */
  static readonly PREVIEW_UNPUBLISHED_APPLICATION = [Role.PORTAL_ADMIN, Role.ADMIN];

  /*
    Permissions for schedule
    */
  static readonly SCHEDULE: typeof SchedulePermissionPerRole = SchedulePermissionPerRole;
}

import { ScheduleTableLinkAction } from '@app/user/schedule/table/domain/actions/ScheduleTableLinkAction';

export class ScheduleTableEditAction extends ScheduleTableLinkAction {

    /**
     * Icon name
     * @type {string}
     */
    iconName: string = 'edit';

    /**
     * Title translation key
     * @type {string}
     */
    titleTranslationKey: string = 'Action.Edit';

}

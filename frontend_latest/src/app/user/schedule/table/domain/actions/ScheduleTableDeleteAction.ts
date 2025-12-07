import { ScheduleTableAction } from '@app/user/schedule/table/domain/schedule-table.action';

export class ScheduleTableDeleteAction implements ScheduleTableAction {

    /**
     * Icon name
     * @type {string}
     */
    iconName: string = 'clear';

    /**
     * Title translation key
     * @type {string}
     */
    titleTranslationKey: string = 'Action.Remove';

    /**
     * Class name
     * @type {string}
     */
    className = 'text-danger';

    /**
     * Type
     * @type {string}
     */
    type = 'button';

}

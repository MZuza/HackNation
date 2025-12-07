import { ScheduleTableAction } from '@app/user/schedule/table/domain/schedule-table.action';

export class ScheduleTableLinkAction implements ScheduleTableAction {

    /**
     * Icon name
     * @type {string}
     */
    iconName: string;

    /**
     * Title translation key
     * @type {string}
     */
    titleTranslationKey: string;

    /**
     * Base url
     * @type {string}
     */
    baseUrl: string;

    /**
     * Type
     * @type {string}
     */
    type = 'link';


    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { StringHelper } from '@app/shared/helpers/string.helper';
import { ScheduleTableAction } from '@app/user/schedule/table/domain/schedule-table.action';

/**
 * Schedule Link Component
 */
@Component({
    selector: 'app-schedule-button',
    templateUrl: './schedule-button.component.html',
    standalone: true,
    imports: [TranslatePipe]
})
export class ScheduleButtonComponent implements ScheduleTableAction {

    /**
     * Url
     * @type {string}
     */
    @Input()
    onClick: (data?: any) => void;

    /**
     * Icon Name
     * @type {string}
     */
    @Input()
    iconName: string;

    /**
     * Title
     * @type {string}
     */
    @Input()
    titleTranslationKey: string;

    /**
     * Class name
     * @type {string}
     */
    @Input()
    className: string;

    /**
     * Button clicked event emitter
     * @type {EventEmitter<MouseEvent>}
     */
    @Output()
    buttonClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    /**
     * Unique id
     */
    generatedId = StringHelper.generateRandomHex();

    /**
     * Emits event when button clicked
     * @param $event
     */
    onButtonClicked($event: MouseEvent) {
        this.buttonClicked.emit($event);
    }
}

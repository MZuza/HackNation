import { ButtonConfig } from '@app/user/schedule/table/domain/button-config';
import { ScheduleTableAction } from '@app/user/schedule/table/domain/schedule-table.action';

/**
 * Schedule Export Source
 */
export type ScheduleExportSource = 'schedules' | 'user_schedules';

/**
 * Schedule Table Config
 */
export class ScheduleTableConfig {

    /**
     * Schedule Table Config Builder
     * @type {{new(): ScheduleTableConfigBuilder, prototype: ScheduleTableConfigBuilder}}
     */
    static builder = class ScheduleTableConfigBuilder {
        private actions: Array<ScheduleTableAction>;
        private leftButton: ButtonConfig;
        private isPartialExport: boolean;
        private isFullExport: boolean;
        private exportSource: ScheduleExportSource;
        private isSettingsForm: boolean;

        /**
         * Adds actions to config
         * @param actions
         * @returns {this}
         */
        withActions(actions: Array<ScheduleTableAction>): ScheduleTableConfigBuilder {
            this.actions = actions;
            return this;
        }

        /**
         * Adds left button to config
         * @param config
         * @returns {this}
         */
        withLeftButton(config: ButtonConfig): ScheduleTableConfigBuilder {
            this.leftButton = config;
            return this;
        }


        /**
         * Adds partial export to config
         * @param config
         * @returns {this}
         */
        withPartialExport(config: boolean): ScheduleTableConfigBuilder {
            this.isPartialExport = config;
            return this;
        }

        /**
         * Adds full export to config
         * @param config
         * @returns {this}
         */
        withFullExport(config: boolean): ScheduleTableConfigBuilder {
            this.isFullExport = config;
            return this;
        }


        /**
         * Adds export source
         * @returns {this}
         * @param source
         */
        withExportSource(source: ScheduleExportSource): ScheduleTableConfigBuilder {
            this.exportSource = source;
            return this;
        }

        withSettingsForm(enabled: boolean): ScheduleTableConfigBuilder {
            this.isSettingsForm = enabled;
            return this;
        }


        /**
         * Setups default config
         * @returns {this}
         */
        default(): ScheduleTableConfigBuilder {
            this.actions = [];
            this.leftButton = null;
            this.isPartialExport = null;
            this.isFullExport = null;
            this.exportSource = 'schedules';
            this.isSettingsForm = true;
            return this;
        }

        /**
         * Builds config
         * @returns {ScheduleTableConfig}
         */
        build(): ScheduleTableConfig {
            return new ScheduleTableConfig(
                this.actions,
                this.leftButton,
                this.isPartialExport,
                this.isFullExport,
                this.exportSource,
                this.isSettingsForm);
        }
    };

    /**
     * @param actions
     * @param leftButton
     * @param isPartialExport
     * @param isFullExport
     * @param exportSource
     * @param isSettingsForm
     */
    constructor(public readonly actions: Array<ScheduleTableAction>,
                public readonly leftButton: ButtonConfig,
                public readonly isPartialExport: boolean,
                public readonly isFullExport: boolean,
                public readonly exportSource: ScheduleExportSource,
                public readonly isSettingsForm: boolean
    ) {
    }
}


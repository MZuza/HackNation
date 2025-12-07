import { TemplateRef } from '@angular/core';

import { Role } from '@app/shared/user-permissions/Role';

/**
 * Column Definition
 */
export class ColumnDefinition {

    /**
     * @param id
     * @param label
     * @param permittedRoles
     * @param customTemplate
     * @param additionalClass
     */
    constructor(public readonly id: string,
                public readonly label: string,
                public readonly permittedRoles: Array<Role> = [],
                public readonly customTemplate?: TemplateRef<any>,
                public readonly additionalClass: string = '') {
    }
}

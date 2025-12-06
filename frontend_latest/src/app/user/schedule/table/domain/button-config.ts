/**
 * Button Config
 */
export class ButtonConfig {

    /**
     * @param label
     * @param url
     * @param onClick
     */
    constructor(public readonly label: string,
                public readonly url?: Array<string> | string,
                public readonly onClick?: (e) => void) {
    }
}

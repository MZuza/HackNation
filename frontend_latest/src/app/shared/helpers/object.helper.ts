/**
 * Static class
 * String Helper, helps manipulating objects
 */
export class ObjectHelper {

    /**
     * Gets data from nested objects.
     * Prevents from 'Cannot read property 'someProperty' of undefined' error.
     * @example ObjectHelper.getNested(exampleObject, ['relationships', 'institutions', 'data', 'id'])
     * @param {any} nestedObject
     * @param {string[]} propsArray
     * @returns {any}
     */
    static getNested(nestedObject: any, propsArray: string[]) {
        return propsArray.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, nestedObject);
    }

    /**
     * isObject Helper function
     * @param {any} item
     * @returns {boolean}
     */
    static isObject(item: any): boolean {
        return Object.prototype.toString.call(item) === '[object Object]';
    }

    /**
     * Flattens nested objects.
     * For nested objects (direct children), removes their parents and pastes children on parent level as siblings.
     * @param {object} object
     * @returns object
     */
    static flattenNestedObjects(object: object): object {
        const source = {...object};
        let flattened = {};

        for (const key in source) {
            if (this.isObject(source[key])) {
                flattened = {
                    ...flattened,
                    ...source[key]
                };

                delete source[key];
            }
        }

        return {
            ...source,
            ...flattened
        };
    }
}

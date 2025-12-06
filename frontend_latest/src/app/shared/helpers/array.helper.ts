/**
 * Array Helper modules
 * Replacement for underscore and lodash functions
 */
export class ArrayHelper {

    /**
     * Groups items by specified key. Key also might be a function, that parses items
     * @param {any[]} collection
     * @param {string | Function} key
     * @returns {any}
     *
     * @example
     * const items = [{name: '', surname: 'Anderson'},...]
     * ArrayHelper.groupBy(items, 'surname') // result: {'Anderson': {...}}
     * ArrayHelper.groupBy(items, item => item.surname.toLowerCase()); // result: {'anderson': {...}}
     */
    static groupBy(collection: any[], key: string | Function) {
        return collection.reduce((result, item) => {
            const v = key instanceof Function ? key(item) : item[key];
            (result[v] = result[v] || []).push(item);
            return result;
        }, {});
    }

    /**
     * Removes null and duplicated values
     * @param {string[]} array
     * @returns {string[]}
     */
    static removeNullsAndDuplicates(array: string[]): string[] {
        return array
            .filter(Boolean)
            .reduce((tempArray: string[], item: string) => {
                if (tempArray.indexOf(item) < 0) {
                    tempArray.push(item);
                }

                return tempArray;
            }, []);
    }

    /**
     * Checks if provided arrays has more then one duplicate
     * @param arrA
     * @param arrB
     * @returns {boolean}
     */
    static checkIfMoreThenOneDuplicate(arrA: any[], arrB: any[]): boolean {
        const bothArraysLength = arrA.length + arrB.length;
        const bothArraysWithoutDuplicates = this.removeNullsAndDuplicates([...arrA, ...arrB]);

        const isNoDuplicates = bothArraysLength === bothArraysWithoutDuplicates.length;
        const isMoreThenOneDuplicate = bothArraysLength - 2 > bothArraysWithoutDuplicates.length;
        if (isNoDuplicates) {
            return false;
        }
        return isMoreThenOneDuplicate;
    }

    /**
     * Converts array values to comma separated string
     * @param value
     * @returns {string}
     */
    static convertArrayValuesToCommaSeparatedString(value: Array<string> | string): string {
        return Array.isArray(value) ? value.join(', ') : value;
    }
}

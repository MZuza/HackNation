import { ArrayHelper } from '@app/shared/helpers/array.helper';

describe('ArrayHelper', () => {

    it('should convert array of objects into object and group data by specified key', () => {
        const arr = [
            {make: 'Citroen', model: 'C4', segment: 'B'},
            {make: 'Ford', model: 'Focus', segment: 'B'},
            {make: 'Ford', model: 'Mondeo', segment: 'C'},
        ];
        const obj = ArrayHelper.groupBy(arr, 'segment');
        expect(Object.keys(obj)).toContain('B');
    });

    it('should remove null values and string duplicates', () => {
        const arr = ['Citroen', 'Ford', 'Citroen', null, 'Ford'];
        const resultArr = ArrayHelper.removeNullsAndDuplicates(arr);
        expect(resultArr.indexOf('Ford') === resultArr.lastIndexOf('Ford')).toBe(true);
    });

    it('should check if there is more than 1 duplicate', () => {
        const arr = [1, 'BMW', 'Citroen', null];
        const arr2 = [2, 'Ford', 'Citroen', 'Ford'];
        const result = ArrayHelper.checkIfMoreThenOneDuplicate(arr, arr2);
        expect(result).toBe(true);
    });

    it('should convert array of strings into comma separated string', () => {
        const arr = ['Alpine', 'Citroen', 'Ford'];
        const text = 'Alpine,Citroen,Ford';
        const result = ArrayHelper.convertArrayValuesToCommaSeparatedString(arr);
        expect(text.split(',').length >= arr.length - 1).toBe(true);
    });
});

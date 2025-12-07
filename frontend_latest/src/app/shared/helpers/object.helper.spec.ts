import { ObjectHelper } from '@app/shared/helpers/object.helper';

describe('ObjectHelper', () => {

    describe('getNested', () => {
        let obj: object;

        beforeEach(() => {
            obj = {
                data: {
                    attributes: {
                        links: {
                            self: 'http://example.com'
                        }
                    }
                }
            };
        });

        it('should get nested, last key', () => {
            const result = ObjectHelper.getNested(obj, ['data', 'attributes', 'links', 'self']);
            expect(result).not.toBe(null);
        });

        it('should not get value if some array value (object property) has been misspelled', () => {
            const result = ObjectHelper.getNested(obj, ['data', 'a', 'links', 'self']);
            expect(result).toBeFalsy();
        });

        it('should not get value if last property does not exist', () => {
            const result = ObjectHelper.getNested(obj, ['data', 'a', 'links', 'self', 'example']);
            expect(result).toBeFalsy();
        });
    });

    describe('isObject', () => {
        it('should confirm if an object is provided', () => {
            const test = {
                data: {
                    testKey: 'test value'
                }
            };
            expect(ObjectHelper.isObject(test)).toBe(true);
        });

        it('should not confirm if an array is provided', () => {
            const test = [{make: 'Ford'}, {make: 'Peugeot'}];
            expect(ObjectHelper.isObject(test)).not.toBe(true);
        });
    });

    it('should remove nested objects (direct children) and paste their children directly to the main object as siblings', () => {
        const obj = {
            id: 1,
            attributes: {
                modified: '2021-03-01T08:29:40.416502+00:00',
                notes: 'Lorem pisum dolor noes',
                title: 'Title lorem',
            },
            links: {
                self: 'http://example.com'
            }
        };

        const result = {
            id: 1,
            modified: '2021-03-01T08:29:40.416502+00:00',
            notes: 'Lorem pisum dolor noes',
            self: 'http://example.com',
            title: 'Title lorem'
        };

        const test = ObjectHelper.flattenNestedObjects(obj);
        expect(test).toEqual(result);
    });
});

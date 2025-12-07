import { StringHelper } from '@app/shared/helpers/string.helper';

describe('StringHelper', () => {

    it('should remove spaces and camelCase text', () => {
        const text = 'Lorem IPSUM doLOR sit amet';
        const result = 'loremIpsumDolorSitAmet';
        expect(StringHelper.toCamelCase(text)).toBe(result);
    });

    it('should capitalize first letter', () => {
        const text = 'lorem';
        const result = 'Lorem';
        expect(StringHelper.capitalizeFirstLetter(text)).toBe(result);
    });

    it('should strip HTML tags', () => {
        const text = 'Lorem <a href="#">External Link</a> ipsum dolor <span>span content</span>';
        const result = 'Lorem External Link ipsum dolor span content';
        expect(StringHelper.stripHtmlTags(text)).toBe(result);
    });

    it('should have lowercase characters', () => {
        const text = 'Lorem IPSUM doLOR sit amet';
        expect(StringHelper.hasLowercase(text)).toBeTruthy();
    });

    it('should have numbers', () => {
        const text = 'Lorem5 ipsum 10';
        expect(StringHelper.hasNumbers(text)).toBe(true);
    });

    it('should have spcial character', () => {
        const text = '@Lorem5-!';
        expect(StringHelper.hasSpecialChars(text)).toBe(true);
    });

    it('should generate random hex string (CSS color)', () => {
        const text = StringHelper.generateRandomHex();
        expect(/^[A-F0-9]+$/i.test(text)).toBe(true);
    });

    it('should generate 6 character long, random string', () => {
        const text = StringHelper.generateRandomHex();
        expect(text.length).toEqual(6);
    });

    it('should trim string from the end by 5 characters and remove all spaces', () => {
        const text = 'Lorem ipsum dolor';
        const charsToRemove = 5;
        expect(StringHelper.trimEndAndRemoveSpaces(text, charsToRemove).length).toEqual(10);
    });
});

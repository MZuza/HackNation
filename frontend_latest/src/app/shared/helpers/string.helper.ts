/**
 * Static class
 * String Helper, helps manipulating strings
 */
export class StringHelper {

    /**
     * Provided string changes to camelCase. Useful for generating component names.
     * @param {string} text
     * @returns {string}
     */
    static toCamelCase(text: string): string {
        return text.toLocaleLowerCase().replace(/(?:^\w|[A-Z]|-|\b\w)/g,
            (ltr, idx) => idx === 0
                ? ltr.toLowerCase()
                : ltr.toUpperCase()
        ).replace(/\s+|-/g, '');
    }

    /**
     * Always return string with uppercase first letter
     * @param {string} text
     * @returns {string}
     */
    static capitalizeFirstLetter(text: string): string {
        return text.trim().charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * Strips string from Html. Useful to remove html tags for description fields from backend formatted text
     * @param {string} text
     * @returns {string}
     */
    static stripHtmlTags(text: string): string {
        return text.replace(/<\/?[^>]+(>|$)/g, '');
    }

    /**
     * Determines whether string has lowercase characters
     * @param {string} text
     * @returns {boolean}
     */
    static hasLowercase(text: string): boolean {
        return /[a-z]+/.test(text);
    }

    /**
     * Determines whether string has uppercase characters
     * @param {string} text
     * @returns {boolean}
     */
    static hasUppercase(text: string): boolean {
        return /[A-Z]+/.test(text);
    }

    /**
     * Determines whether string has numbers
     * @param {string} text
     * @returns {boolean}
     */
    static hasNumbers(text: string): boolean {
        return /[0-9]+/.test(text);
    }

    /**
     * Determines whether string has special characters
     * @param {string} text
     * @returns {boolean}
     */
    static hasSpecialChars(text: string): boolean {
        return /[!-\/:-@\[-`\{-~]/g.test(text);
    }

    /**
     * Generates random hex string
     * @returns {string}
     */
    static generateRandomHex(): string {
        return Math.random().toString(16).substring(2, 8);
    }

    /**
     * Trims string at the end and remove spaces
     * @param text
     * @param charactersToTrim
     * @returns {string}
     */
    static trimEndAndRemoveSpaces(text: string, charactersToTrim: number): string {
        const trimmed = text.trim().slice(0, -charactersToTrim);
        return trimmed.replace(/ /g, '');
    }
}

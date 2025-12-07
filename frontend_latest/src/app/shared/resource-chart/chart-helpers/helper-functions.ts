/**
 * Breaks long text into lines
 * @param {string} longText
 * @param {number} [wordsInLine]
 * @returns {string}
 */
export function breakLongText(longText: string, wordsInLine: number = 5): string {
  return longText.split(' ').reduce((textLine: string, word: string, index: number, textArray: string[]) => {
    if (wordsInLine <= 1) {
      wordsInLine = 2;
    }

    if (index % wordsInLine === wordsInLine - 1) {
      if (index === textArray.length - 1) {
        return `${textLine} ${word}`;
      } else {
        return `${textLine} ${word}\n`;
      }
    }

    return `${textLine} ${word}`;
  }, '');
}

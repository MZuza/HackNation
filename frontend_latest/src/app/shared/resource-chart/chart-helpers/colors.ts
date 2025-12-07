/**
 * Gets array of colors with specified opacity
 * @param {number} [opacity]
 * @returns {string[]}
 */
function getColorPalette(opacity: number = 0.8): string[] {
  return [
    `rgba(136, 189, 230, ${opacity})`,
    `rgba(70, 107, 176, ${opacity})`,
    `rgba(132, 208, 224, ${opacity})`,
    `rgba(0, 95, 173, ${opacity})`,
    `rgba(255, 130, 176, ${opacity})`,
    `rgba(221, 202, 154, ${opacity})`,
    `rgba(0, 149, 135, ${opacity})`,
    `rgba(131, 170, 202, ${opacity})`,
    `rgba(45, 159, 199, ${opacity})`,
    `rgba(156, 136, 217, ${opacity})`,
    `rgba(116, 147, 205, ${opacity})`,
    `rgba(123, 181, 174, ${opacity})`,
    `rgba(42, 159, 214, ${opacity})`,
    `rgba(92, 184,  92, ${opacity})`,
    `rgba(24, 188, 156, ${opacity})`,
    `rgba(55, 90, 127, ${opacity})`,
    `rgba(3, 62, 118, ${opacity})`,
    `rgba(251, 178, 88, ${opacity})`,
    `rgba(200, 180, 34, ${opacity})`,
    `rgba(244, 130, 86, ${opacity})`,
    `rgba(68, 85, 102, ${opacity})`,
  ];
}

/**
 * Color palette with partial opacity
 */
export const transparentColors = getColorPalette();

/**
 * Color palette with full opacity
 */
export const solidColors = getColorPalette(1);

/**
 * Background and border colors for chart.js
 */
export const backgroundAndBorderColors = solidColors.map((solidColor, index) => {
  return {
    backgroundColor: transparentColors[index],
    borderColor: solidColor,
  };
});

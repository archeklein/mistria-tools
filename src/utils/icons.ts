/**
 * Utility functions for getting asset URLs using Vite's proper asset importing
 */

/**
 * Get character icon URL from filename
 * @param iconFilename - The filename of the character icon (e.g., "Adeline_icon.webp")
 * @returns The full URL to the character icon
 */
export const getCharacterIcon = (iconFilename: string): string => {
  return new URL(`../assets/characters/${iconFilename}`, import.meta.url).href;
};

/**
 * Get item icon URL from filename
 * @param iconFilename - The filename of the item icon (e.g., "Apple.webp")
 * @returns The full URL to the item icon
 */
export const getItemIcon = (iconFilename: string): string => {
  return new URL(`../assets/items/${iconFilename}`, import.meta.url).href;
};

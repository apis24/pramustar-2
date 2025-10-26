/**
 * Text parsing utility for semaphore animation
 * Converts input text to uppercase, collapses multiple spaces, and splits into tokens
 */

export const parseText = (input: string): string[] => {
  // Convert to uppercase
  const upperText = input.toUpperCase();

  // Collapse multiple spaces to single spaces and trim
  const collapsedText = upperText.replace(/\s+/g, ' ').trim();

  // Split into individual character tokens
  // Each character becomes a token for the animation
  const tokens = collapsedText.split('');

  return tokens;
};

/**
 * Validates that a character can be displayed in semaphore
 * @param character - Single character to validate
 * @returns true if character is A-Z or space
 */
export const isValidSemaphoreChar = (character: string): boolean => {
  return /^[A-Z ]$/.test(character);
};

/**
 * Filters out characters that cannot be displayed in semaphore
 * @param tokens - Array of character tokens
 * @returns Filtered array with only valid semaphore characters
 */
export const filterValidTokens = (tokens: string[]): string[] => {
  return tokens.filter(token => isValidSemaphoreChar(token));
};
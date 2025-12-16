/**
 * Calculate estimated reading time for text content
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Estimated reading time in minutes
 */
export const calculateReadingTime = (
  text: string,
  wordsPerMinute: number = 200
): number => {
  // Remove HTML tags and extra whitespace
  const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

  // Count words
  const wordCount = cleanText.trim().split(/\s+/).length;

  // Calculate minutes, round up to nearest minute
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
};

/**
 * Format reading time as human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
};

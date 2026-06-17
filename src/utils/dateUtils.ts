/**
 * Date formatting utilities for BS WeeStaater
 * Centralizes all date formatting logic to avoid duplication
 */

/**
 * Format DD/MM/YYYY string to "dd MMM" (e.g., "01 Jan")
 * @param dateString - Date in DD/MM/YYYY format
 * @returns Formatted date string
 */
export function formatDateToDDMMM(dateString: string): string {
  // Split the input string into day, month, year
  const [day, month, year] = dateString.split("/").map(Number);

  // Create a date object (months are 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);

  // Format the date as "dd MMM"
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Format ISO date string to "d MMM yyyy" (e.g., "1 Jan 2024")
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string or original if invalid
 */
export function formatDateMedium(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format ISO date string to "dd MMM yyyy" (e.g., "01 Jan 2024")
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string
 */
export function formatDateMediumPadded(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format ISO date string with weekday (e.g., "Mon, Jan 1")
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string with weekday
 */
export function formatDateWithWeekday(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Convert Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Convert DD/MM/YYYY format to YYYY-MM-DD format
 * @param dateString - Date in DD/MM/YYYY format
 * @returns Date in YYYY-MM-DD format
 */
export function convertDDMMYYYYtoISO(dateString: string): string {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

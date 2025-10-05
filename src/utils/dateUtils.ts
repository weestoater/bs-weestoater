export function formatDateToDDMMM(dateString: string) {
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

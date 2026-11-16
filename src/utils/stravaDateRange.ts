import type { StravaActivity } from "../interfaces/StravaActivity";

export const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All time", months: null },
  { value: "1", label: "Last month", months: 1 },
  { value: "3", label: "Last 3 months", months: 3 },
  { value: "6", label: "Last 6 months", months: 6 },
  { value: "12", label: "Last 12 months", months: 12 },
] as const;

export type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]["value"];

export function filterActivitiesByDateRange(
  activities: StravaActivity[],
  range: DateRangeValue,
  now: Date = new Date(),
): StravaActivity[] {
  const option = DATE_RANGE_OPTIONS.find((o) => o.value === range);
  if (!option || option.months === null) return activities;

  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - option.months);
  return activities.filter((activity) => new Date(activity.startDateLocal) >= cutoff);
}

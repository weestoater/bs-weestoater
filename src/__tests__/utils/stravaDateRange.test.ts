import { describe, expect, it } from "vitest";
import type { StravaActivity } from "../../interfaces/StravaActivity";
import { filterActivitiesByDateRange } from "../../utils/stravaDateRange";

const activity = (id: number, startDateLocal: string) =>
  ({ id, startDateLocal }) as StravaActivity;

describe("filterActivitiesByDateRange", () => {
  const now = new Date("2026-11-16T12:00:00Z");
  const activities = [
    activity(1, "2026-11-10T08:00:00Z"),
    activity(2, "2026-08-20T08:00:00Z"),
    activity(3, "2026-06-01T08:00:00Z"),
    activity(4, "2025-12-01T08:00:00Z"),
  ];

  it("returns every activity for all time", () => {
    expect(filterActivitiesByDateRange(activities, "all", now)).toHaveLength(4);
  });

  it("keeps activities within the last month", () => {
    expect(filterActivitiesByDateRange(activities, "1", now).map((a) => a.id)).toEqual([1]);
  });

  it("keeps activities within the last 3 and 6 months", () => {
    expect(filterActivitiesByDateRange(activities, "3", now).map((a) => a.id)).toEqual([1, 2]);
    expect(filterActivitiesByDateRange(activities, "6", now).map((a) => a.id)).toEqual([1, 2, 3]);
  });
});

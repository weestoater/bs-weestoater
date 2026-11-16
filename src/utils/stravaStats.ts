import type { StravaActivity } from "../interfaces/StravaActivity";
import { METERS_PER_MILE } from "./stravaFormat";

export interface StravaTotals {
  count: number;
  miles: number;
  minutes: number;
  calories: number;
}

export function summarizeActivities(activities: StravaActivity[]): StravaTotals {
  let meters = 0;
  let seconds = 0;
  let calories = 0;
  for (const activity of activities) {
    meters += activity.distanceM;
    seconds += activity.movingTimeS;
    calories += activity.calories ?? 0;
  }
  return {
    count: activities.length,
    miles: meters / METERS_PER_MILE,
    minutes: seconds / 60,
    calories: Math.round(calories),
  };
}

export interface ActivityCategory {
  key: string;
  label: string;
  icon: string;
  /** Bootstrap background class used for selected filter buttons and badges. */
  colorClass: string;
}

const BIKE: ActivityCategory = {
  key: "BikeRide",
  label: "Bike",
  icon: "bi-bicycle",
  colorClass: "bg-primary",
};

const CATEGORIES: Record<string, ActivityCategory> = {
  Ride: BIKE,
  MountainBikeRide: BIKE,
  GravelRide: BIKE,
  EBikeRide: BIKE,
  VirtualRide: BIKE,
  Walk: {
    key: "Walk",
    label: "Walk",
    icon: "bi-person-walking",
    colorClass: "bg-success",
  },
  Hike: {
    key: "Hike",
    label: "Hike",
    icon: "bi-tree",
    colorClass: "bg-warning text-dark",
  },
  Run: {
    key: "Run",
    label: "Run",
    icon: "bi-speedometer2",
    colorClass: "bg-danger",
  },
  Swim: {
    key: "Swim",
    label: "Swim",
    icon: "bi-water",
    colorClass: "bg-info",
  },
  WeightTraining: {
    key: "WeightTraining",
    label: "Weight training",
    icon: "bi-trophy",
    colorClass: "bg-dark",
  },
};

const FALLBACK: ActivityCategory = {
  key: "Other",
  label: "Other",
  icon: "bi-lightning-charge",
  colorClass: "bg-secondary",
};

export function getActivityCategory(sportType: string | null): ActivityCategory {
  if (!sportType) return FALLBACK;
  return CATEGORIES[sportType] ?? { ...FALLBACK, key: sportType, label: sportType };
}

export interface ActivityTypeCount extends ActivityCategory {
  count: number;
}

/** Counts activities per category, most frequent first. */
export function countActivityTypes(
  activities: { sportType: string | null }[],
): [string, ActivityTypeCount][] {
  const counts = new Map<string, ActivityTypeCount>();
  for (const activity of activities) {
    const category = getActivityCategory(activity.sportType);
    const entry = counts.get(category.key);
    if (entry) entry.count += 1;
    else counts.set(category.key, { ...category, count: 1 });
  }
  return [...counts.entries()].sort(([, a], [, b]) => b.count - a.count);
}

/** Returns activities whose category key is selected; an empty selection returns all. */
export function filterActivitiesByType<T extends { sportType: string | null }>(
  activities: T[],
  selectedKeys: string[],
): T[] {
  if (selectedKeys.length === 0) return activities;
  return activities.filter((activity) =>
    selectedKeys.includes(getActivityCategory(activity.sportType).key),
  );
}

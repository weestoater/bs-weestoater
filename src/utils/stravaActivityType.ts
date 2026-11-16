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

export interface GarminActivity {
  id: string;
  date: string; // ISO date string
  type: "running" | "cycling" | "walking" | "swimming" | "other";
  distance: number; // in kilometers
  duration: number; // in seconds
  calories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePace?: number; // minutes per km
  elevation?: number; // in meters
  notes?: string;
}

export interface GarminActivitySummary {
  totalActivities: number;
  totalDistance: number; // km
  totalDuration: number; // seconds
  totalCalories: number;
  activitiesByType: Record<string, number>;
}

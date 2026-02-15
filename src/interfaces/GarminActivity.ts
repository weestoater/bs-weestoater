export interface GPSPoint {
  lat: number;
  lng: number;
}

export interface GPSData {
  startPoint?: GPSPoint;
  endPoint?: GPSPoint;
  polyline?: string; // Encoded polyline string
  coordinates?: GPSPoint[]; // Decoded coordinates
}

export interface GarminActivity {
  id: string;
  date: string; // ISO date string
  type: "running" | "cycling" | "walking" | "swimming" | "other";
  distance: number; // in miles
  duration: number; // in seconds
  calories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePace?: number; // minutes per mile
  elevation?: number; // in feet
  steps?: number;
  notes?: string;
  gpsData?: GPSData; // GPS tracking data
}

export interface GarminActivitySummary {
  totalActivities: number;
  totalDistance: number; // km
  totalDuration: number; // seconds
  totalCalories: number;
  activitiesByType: Record<string, number>;
}

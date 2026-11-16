/** Activity as stored in Supabase (SI units) and returned by fetchStravaActivities. */
export interface StravaActivity {
  id: number;
  name: string;
  sportType: string;
  startDateLocal: string;
  distanceM: number;
  movingTimeS: number;
  elevationGainM: number;
  averageSpeedMs: number | null;
  averageHeartrate: number | null;
  maxHeartrate: number | null;
  polyline: string | null;
  calories: number | null;
}

/** Extra fields stored by the strava-sync Edge Function. */
export interface StravaActivityDetail extends StravaActivity {
  description: string | null;
}

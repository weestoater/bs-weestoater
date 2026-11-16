/** Activity as returned by the strava-activities Netlify function (SI units). */
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
}

/** Extra fields returned by the strava-activity Netlify function. */
export interface StravaActivityDetail extends StravaActivity {
  description: string | null;
  calories: number | null;
}

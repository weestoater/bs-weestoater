import type {
  StravaActivity,
  StravaActivityDetail,
} from "../interfaces/StravaActivity";

import { getSupabaseClient } from "../../backend/index.js";

interface StravaActivityRow {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  distance_m: number;
  moving_time_s: number;
  elevation_gain_m: number;
  average_speed_ms: number | null;
  average_heartrate: number | null;
  max_heartrate: number | null;
  summary_polyline: string | null;
  description: string | null;
  detailed_polyline: string | null;
  calories: number | null;
}

const LIST_COLUMNS =
  "id, name, sport_type, start_date_local, distance_m, moving_time_s, elevation_gain_m, average_speed_ms, average_heartrate, max_heartrate, summary_polyline";

const DETAIL_COLUMNS = `${LIST_COLUMNS}, description, detailed_polyline, calories`;

function toActivity(row: StravaActivityRow): StravaActivity {
  return {
    id: row.id,
    name: row.name,
    sportType: row.sport_type,
    startDateLocal: row.start_date_local,
    distanceM: row.distance_m,
    movingTimeS: row.moving_time_s,
    elevationGainM: row.elevation_gain_m,
    averageSpeedMs: row.average_speed_ms,
    averageHeartrate: row.average_heartrate,
    maxHeartrate: row.max_heartrate,
    polyline: row.summary_polyline,
  };
}

export async function fetchStravaActivities(): Promise<StravaActivity[]> {
  const { data, error } = await getSupabaseClient()
    .from("strava_activities")
    .select(LIST_COLUMNS)
    .order("start_date_local", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as unknown as StravaActivityRow[]).map(toActivity);
}

export async function fetchStravaActivityDetail(
  id: number,
): Promise<StravaActivityDetail> {
  const { data, error } = await getSupabaseClient()
    .from("strava_activities")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  const row = data as unknown as StravaActivityRow;
  return {
    ...toActivity(row),
    polyline: row.detailed_polyline ?? row.summary_polyline,
    description: row.description,
    calories: row.calories,
  };
}

export async function isStravaAdmin(): Promise<boolean> {
  const { data, error } = await getSupabaseClient().rpc("is_strava_admin");
  if (error) return false;
  return data === true;
}

export async function triggerStravaSync(): Promise<{
  activities: number;
  detailsFetched: number;
  rateLimited: boolean;
}> {
  const { data, error } = await getSupabaseClient().functions.invoke("strava-sync");
  if (error) {
    const context = (error as { context?: Response }).context;
    const body = context ? await context.json().catch(() => null) : null;
    throw new Error(body?.error ?? error.message);
  }
  return data;
}

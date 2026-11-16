import type {
  StravaActivity,
  StravaActivityDetail,
} from "../interfaces/StravaActivity";

// Static JSON written by scripts/sync-strava.js; no secrets are exposed to the browser.
const DATA_BASE = "/data/strava";

async function requestJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function fetchStravaActivities(): Promise<StravaActivity[]> {
  const body = await requestJson<{ activities: StravaActivity[] }>(
    `${DATA_BASE}/activities.json`,
  );
  return body.activities;
}

export async function fetchStravaActivityDetail(
  id: number,
): Promise<StravaActivityDetail> {
  return requestJson<StravaActivityDetail>(`${DATA_BASE}/activity-${id}.json`);
}

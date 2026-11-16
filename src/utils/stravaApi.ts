import type {
  StravaActivity,
  StravaActivityDetail,
} from "../interfaces/StravaActivity";

async function requestJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body as T;
}

export async function fetchStravaActivities(): Promise<StravaActivity[]> {
  const body = await requestJson<{ activities: StravaActivity[] }>(
    "/.netlify/functions/strava-activities",
  );
  return body.activities;
}

export async function fetchStravaActivityDetail(
  id: number,
): Promise<StravaActivityDetail> {
  const body = await requestJson<{ activity: StravaActivityDetail }>(
    `/.netlify/functions/strava-activity?id=${id}`,
  );
  return body.activity;
}

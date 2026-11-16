/**
 * Server-side Strava API client shared by the Netlify functions.
 *
 * Holds the client secret and refresh token, so they must never be bundled
 * into the browser build (no VITE_ prefix).
 *
 * Environment variables:
 *   VITE_STRAVA_CLIENT_ID - Strava API client ID (public)
 *   STRAVA_CLIENT_SECRET  - Strava API client secret
 *   STRAVA_REFRESH_TOKEN  - Refresh token with activity:read_all scope
 */

const API_BASE = "https://www.strava.com/api/v3";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const CACHE_TTL_MS = 15 * 60 * 1000;
export const CACHE_CONTROL = "public, max-age=0, s-maxage=900";
const PER_PAGE = 200;

let accessToken = null;
let accessTokenExpiresAt = 0;
let refreshToken = process.env.STRAVA_REFRESH_TOKEN;

const cache = new Map();

export class StravaError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt - 60_000) {
    return accessToken;
  }

  const clientId = process.env.VITE_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new StravaError("Strava is not configured on the server", 500);
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new StravaError("Strava token refresh failed", 502);
  }

  accessToken = data.access_token;
  accessTokenExpiresAt = data.expires_at * 1000;
  refreshToken = data.refresh_token || refreshToken;
  return accessToken;
}

async function stravaGet(path) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 429) {
    throw new StravaError("Strava rate limit reached, try again later", 429);
  }
  if (!res.ok) {
    throw new StravaError(`Strava API error (${res.status})`, 502);
  }
  return res.json();
}

async function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() < hit.expiresAt) return hit.value;

  const value = await loader();
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

function toSummary(activity) {
  return {
    id: activity.id,
    name: activity.name,
    sportType: activity.sport_type || activity.type,
    startDateLocal: activity.start_date_local,
    distanceM: activity.distance ?? 0,
    movingTimeS: activity.moving_time ?? 0,
    elevationGainM: activity.total_elevation_gain ?? 0,
    averageSpeedMs: activity.average_speed ?? null,
    averageHeartrate: activity.average_heartrate ?? null,
    maxHeartrate: activity.max_heartrate ?? null,
    polyline: activity.map?.summary_polyline || null,
  };
}

function toDetail(activity) {
  return {
    ...toSummary(activity),
    description: activity.description || null,
    calories: activity.calories ?? null,
    polyline: activity.map?.polyline || activity.map?.summary_polyline || null,
  };
}

export function listActivities() {
  return cached("activities", async () => {
    const all = [];
    for (let page = 1; ; page++) {
      const batch = await stravaGet(
        `/athlete/activities?per_page=${PER_PAGE}&page=${page}`,
      );
      all.push(...batch.map(toSummary));
      if (batch.length < PER_PAGE) break;
    }
    return all;
  });
}

export function getActivity(id) {
  return cached(`activity:${id}`, async () =>
    toDetail(await stravaGet(`/activities/${id}`)),
  );
}

export function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

export function errorResponse(err) {
  if (err instanceof StravaError) {
    return jsonResponse(err.status, { error: err.message });
  }
  console.error("Strava function error:", err);
  return jsonResponse(500, { error: "Unexpected error loading Strava data" });
}

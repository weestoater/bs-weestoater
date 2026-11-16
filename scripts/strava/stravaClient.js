/**
 * Server-side Strava API client used by scripts/sync-strava.js.
 *
 * Runs only on the server or in a local terminal, never in the browser.
 */

const API_BASE = "https://www.strava.com/api/v3";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const PER_PAGE = 200;

export class StravaError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function createStravaClient({ clientId, clientSecret, refreshToken, onRefreshToken }) {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new StravaError("Missing STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET or refresh token", 500);
  }

  let accessToken = null;
  let accessTokenExpiresAt = 0;
  let currentRefreshToken = refreshToken;

  async function getAccessToken() {
    if (accessToken && Date.now() < accessTokenExpiresAt - 60_000) {
      return accessToken;
    }

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: currentRefreshToken,
        grant_type: "refresh_token",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) {
      throw new StravaError(`Strava token refresh failed (${res.status})`, 502);
    }

    accessToken = data.access_token;
    accessTokenExpiresAt = data.expires_at * 1000;
    // Strava may rotate the refresh token on every refresh; keep the newest one.
    if (data.refresh_token && data.refresh_token !== currentRefreshToken) {
      currentRefreshToken = data.refresh_token;
      await onRefreshToken?.(currentRefreshToken);
    }
    return accessToken;
  }

  async function get(path) {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 429) {
      throw new StravaError("Strava rate limit reached, try again later", 429);
    }
    if (!res.ok) {
      throw new StravaError(`Strava API error (${res.status}) for ${path}`, 502);
    }
    return res.json();
  }

  async function listActivities() {
    const all = [];
    for (let page = 1; ; page++) {
      const batch = await get(`/athlete/activities?per_page=${PER_PAGE}&page=${page}`);
      all.push(...batch);
      if (batch.length < PER_PAGE) break;
    }
    return all;
  }

  function getActivity(id) {
    return get(`/activities/${id}`);
  }

  return { listActivities, getActivity };
}

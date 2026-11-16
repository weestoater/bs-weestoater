// Syncs Strava activities into Supabase. Called by the admin "Sync" button on the
// Strava page (signed-in admin JWT) or by a scheduled job (service role key).
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const API_BASE = "https://www.strava.com/api/v3";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const PER_PAGE = 200;
// Strava allows 100 requests per 15 minutes; stay well under it per run.
const MAX_DETAILS_PER_RUN = 80;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

class SyncError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function getAccessToken(db: SupabaseClient): Promise<string> {
  const { data: stored } = await db
    .from("strava_tokens")
    .select("refresh_token")
    .eq("id", 1)
    .maybeSingle();
  const currentRefreshToken = stored?.refresh_token ?? Deno.env.get("STRAVA_REFRESH_TOKEN");
  if (!currentRefreshToken) throw new SyncError("No Strava refresh token configured", 500);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      client_id: Deno.env.get("STRAVA_CLIENT_ID") ?? "",
      client_secret: Deno.env.get("STRAVA_CLIENT_SECRET") ?? "",
      refresh_token: currentRefreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new SyncError(`Strava token refresh failed (${res.status})`, 502);
  }

  // Strava rotates the refresh token on refresh; keep the newest one.
  if (data.refresh_token && data.refresh_token !== currentRefreshToken) {
    const { error } = await db
      .from("strava_tokens")
      .upsert({ id: 1, refresh_token: data.refresh_token, updated_at: new Date().toISOString() });
    if (error) throw new SyncError(`Could not store refreshed token: ${error.message}`, 500);
  }
  return data.access_token;
}

async function stravaGet(token: string, path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 429) throw new SyncError("Strava rate limit reached, try again later", 429);
  if (!res.ok) throw new SyncError(`Strava API error (${res.status}) for ${path}`, 502);
  return res.json();
}

async function syncStrava(db: SupabaseClient) {
  const token = await getAccessToken(db);

  const activities: any[] = [];
  for (let page = 1; ; page++) {
    const batch = await stravaGet(token, `/athlete/activities?per_page=${PER_PAGE}&page=${page}`);
    activities.push(...batch);
    if (batch.length < PER_PAGE) break;
  }

  // Only summary columns are upserted, so detail columns already stored are kept.
  const summaries = activities.map((a) => ({
    id: a.id,
    name: a.name,
    sport_type: a.sport_type || a.type,
    start_date_local: a.start_date_local,
    distance_m: a.distance ?? 0,
    moving_time_s: a.moving_time ?? 0,
    elevation_gain_m: a.total_elevation_gain ?? 0,
    average_speed_ms: a.average_speed ?? null,
    average_heartrate: a.average_heartrate ?? null,
    max_heartrate: a.max_heartrate ?? null,
    summary_polyline: a.map?.summary_polyline || null,
    synced_at: new Date().toISOString(),
  }));
  if (summaries.length > 0) {
    const { error } = await db.from("strava_activities").upsert(summaries, { onConflict: "id" });
    if (error) throw new SyncError(`Could not save activities: ${error.message}`, 500);
  }

  const { data: pending, error: pendingError } = await db
    .from("strava_activities")
    .select("id")
    .is("details_synced_at", null)
    .order("start_date_local", { ascending: false })
    .limit(MAX_DETAILS_PER_RUN);
  if (pendingError) throw new SyncError(`Could not load pending details: ${pendingError.message}`, 500);

  let detailsFetched = 0;
  let rateLimited = false;
  for (const { id } of pending ?? []) {
    try {
      const a = await stravaGet(token, `/activities/${id}`);
      const { error } = await db
        .from("strava_activities")
        .update({
          description: a.description || null,
          calories: a.calories ?? null,
          detailed_polyline: a.map?.polyline || a.map?.summary_polyline || null,
          details_synced_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw new SyncError(`Could not save details: ${error.message}`, 500);
      detailsFetched++;
    } catch (err) {
      if (err instanceof SyncError && err.status === 429) {
        rateLimited = true;
        break;
      }
      throw err;
    }
  }

  return { activities: summaries.length, detailsFetched, rateLimited };
}

async function isAuthorised(db: SupabaseClient, token: string): Promise<boolean> {
  if (token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return true;
  const { data } = await db.auth.getUser(token);
  if (!data.user) return false;
  const { data: admin } = await db
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return admin !== null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) return json(401, { error: "Sign in to sync Strava" });

  const db = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  if (!(await isAuthorised(db, token))) return json(403, { error: "Not allowed to sync Strava" });

  try {
    return json(200, await syncStrava(db));
  } catch (err) {
    if (err instanceof SyncError) return json(err.status, { error: err.message });
    console.error("strava-sync failed:", err);
    return json(500, { error: "Unexpected error during Strava sync" });
  }
});

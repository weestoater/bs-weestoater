#!/usr/bin/env node

/**
 * Syncs Strava activities to static JSON for the Strava page.
 *
 * Writes activities.json (summaries, every run) and activity-<id>.json
 * (details, fetched once per activity and then reused).
 *
 * Usage:
 *   node --env-file=.env scripts/sync-strava.js
 *
 * Environment variables:
 *   STRAVA_CLIENT_ID      - Strava API client ID
 *   STRAVA_CLIENT_SECRET  - Strava API client secret
 *   STRAVA_REFRESH_TOKEN  - Refresh token with activity:read_all scope
 *   STRAVA_OUTPUT_DIR     - Where the JSON is written (default: public/data/strava)
 *   STRAVA_STATE_FILE     - Holds the latest rotated refresh token (default: .strava-state.json)
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStravaClient, StravaError } from "./strava/stravaClient.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(root, process.env.STRAVA_OUTPUT_DIR || "public/data/strava");
const stateFile = path.resolve(root, process.env.STRAVA_STATE_FILE || ".strava-state.json");

async function readState() {
  try {
    return JSON.parse(await readFile(stateFile, "utf8"));
  } catch {
    return {};
  }
}

// Write to a temp file and rename so the page never reads a half-written file.
async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(data));
  await rename(tmp, file);
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

async function main() {
  const state = await readState();
  const client = createStravaClient({
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    refreshToken: state.refreshToken || process.env.STRAVA_REFRESH_TOKEN,
    onRefreshToken: (token) => writeJson(stateFile, { refreshToken: token }),
  });

  const summaries = (await client.listActivities()).map(toSummary);
  await writeJson(path.join(outputDir, "activities.json"), {
    syncedAt: new Date().toISOString(),
    activities: summaries,
  });
  console.log(`Wrote ${summaries.length} activities`);

  let fetched = 0;
  for (const { id } of summaries) {
    const file = path.join(outputDir, `activity-${id}.json`);
    if (existsSync(file)) continue;
    try {
      await writeJson(file, toDetail(await client.getActivity(id)));
      fetched++;
    } catch (err) {
      if (err instanceof StravaError && err.status === 429) {
        console.warn("Rate limited; remaining details will be fetched on the next run");
        break;
      }
      throw err;
    }
  }
  console.log(`Fetched ${fetched} new activity details`);
}

main().catch((err) => {
  console.error(`Strava sync failed: ${err.message}`);
  process.exit(1);
});

/**
 * Netlify Serverless Function: list Strava activities
 *
 * GET /.netlify/functions/strava-activities
 */

import {
  CACHE_CONTROL,
  errorResponse,
  jsonResponse,
  listActivities,
} from "../lib/strava.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const activities = await listActivities();
    return jsonResponse(200, { activities }, { "Cache-Control": CACHE_CONTROL });
  } catch (err) {
    return errorResponse(err);
  }
}

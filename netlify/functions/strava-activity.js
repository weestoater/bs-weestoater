/**
 * Netlify Serverless Function: Strava activity detail
 *
 * GET /.netlify/functions/strava-activity?id=<activityId>
 */

import {
  CACHE_CONTROL,
  errorResponse,
  getActivity,
  jsonResponse,
} from "../lib/strava.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const id = event.queryStringParameters?.id;
  if (!id || !/^\d+$/.test(id)) {
    return jsonResponse(400, { error: "A numeric activity id is required" });
  }

  try {
    const activity = await getActivity(id);
    return jsonResponse(200, { activity }, { "Cache-Control": CACHE_CONTROL });
  } catch (err) {
    return errorResponse(err);
  }
}

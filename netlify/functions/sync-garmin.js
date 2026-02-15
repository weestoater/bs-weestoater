/**
 * Netlify Serverless Function: Sync Garmin Activities
 *
 * This function authenticates with Garmin Connect and fetches recent activities.
 *
 * Environment variables required:
 *   GARMIN_USERNAME - Your Garmin Connect email
 *   GARMIN_PASSWORD - Your Garmin Connect password
 *
 * Usage:
 *   POST /api/sync-garmin
 *   Body: { limit?: number }
 */

import fetch from "node-fetch";

// Simplified Garmin sync without external dependencies
async function syncGarminActivities(username, password, limit = 20) {
  try {
    // Note: This is a simplified implementation
    // In production, you'd use the garmin-connect package or implement full OAuth flow

    return {
      success: false,
      error:
        "This endpoint requires the garmin-connect npm package. Please use the CLI script instead.",
      message: "Run: node scripts/sync-garmin-activities.js",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Get credentials from environment
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Garmin credentials not configured",
          message:
            "Please set GARMIN_USERNAME and GARMIN_PASSWORD environment variables in Netlify",
        }),
      };
    }

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const limit = body.limit || 20;

    // Sync activities
    const result = await syncGarminActivities(username, password, limit);

    if (result.success) {
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
}

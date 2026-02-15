/**
 * Garmin Connect API Client
 *
 * This module provides methods to interact with Garmin Connect API
 * to fetch activity data.
 *
 * Note: Garmin uses OAuth 1.0a for authentication
 */

import fetch from "node-fetch";
import crypto from "crypto";

class GarminClient {
  constructor(config) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.accessToken = config.accessToken;
    this.accessTokenSecret = config.accessTokenSecret;
    this.baseUrl = "https://apis.garmin.com/wellness-api/rest";
  }

  /**
   * Generate OAuth 1.0a signature
   */
  generateOAuthSignature(method, url, params) {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString("hex");

    const oauthParams = {
      oauth_consumer_key: this.consumerKey,
      oauth_token: this.accessToken,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: "1.0",
      ...params,
    };

    // Sort parameters
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`,
      )
      .join("&");

    // Create signature base string
    const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;

    // Create signing key
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(this.accessTokenSecret)}`;

    // Generate signature
    const signature = crypto
      .createHmac("sha1", signingKey)
      .update(signatureBase)
      .digest("base64");

    oauthParams.oauth_signature = signature;

    return oauthParams;
  }

  /**
   * Build OAuth header
   */
  buildOAuthHeader(oauthParams) {
    const headerParts = Object.keys(oauthParams)
      .sort()
      .map(
        (key) =>
          `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`,
      )
      .join(", ");

    return `OAuth ${headerParts}`;
  }

  /**
   * Fetch activities from Garmin Connect
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of activities
   */
  async fetchActivities(startDate, endDate) {
    const url = `${this.baseUrl}/activities`;
    const params = {
      uploadStartTimeInSeconds: Math.floor(
        new Date(startDate).getTime() / 1000,
      ),
      uploadEndTimeInSeconds: Math.floor(new Date(endDate).getTime() / 1000),
    };

    const oauthParams = this.generateOAuthSignature("GET", url, params);
    const authHeader = this.buildOAuthHeader(oauthParams);

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    try {
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Garmin API error: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching Garmin activities:", error);
      throw error;
    }
  }

  /**
   * Transform Garmin activity to our internal format
   */
  transformActivity(garminActivity) {
    // Map activity type
    const typeMap = {
      RUNNING: "running",
      CYCLING: "cycling",
      WALKING: "walking",
      SWIMMING: "swimming",
      INDOOR_CYCLING: "cycling",
      TREADMILL_RUNNING: "running",
      OPEN_WATER_SWIMMING: "swimming",
      LAP_SWIMMING: "swimming",
    };

    const type = typeMap[garminActivity.activityType] || "other";

    // Convert meters to miles
    const distanceInMiles = (garminActivity.distance || 0) * 0.000621371;

    // Calculate average pace if available (minutes per mile)
    let averagePace = null;
    if (garminActivity.distance && garminActivity.duration) {
      const milesPerSecond = distanceInMiles / garminActivity.duration;
      averagePace = milesPerSecond > 0 ? 1 / (milesPerSecond * 60) : null;
    }

    // Convert meters to feet
    const elevationInFeet = (garminActivity.elevationGain || 0) * 3.28084;

    return {
      id: garminActivity.activityId || crypto.randomBytes(8).toString("hex"),
      date: garminActivity.startTimeGMT || garminActivity.startTimeLocal,
      type,
      distance: parseFloat(distanceInMiles.toFixed(2)),
      duration: garminActivity.duration || 0,
      calories: garminActivity.calories || null,
      averageHeartRate: garminActivity.averageHR || null,
      maxHeartRate: garminActivity.maxHR || null,
      averagePace: averagePace ? parseFloat(averagePace.toFixed(2)) : null,
      elevation: elevationInFeet
        ? parseFloat(elevationInFeet.toFixed(2))
        : null,
      steps: garminActivity.steps || null,
      notes: garminActivity.activityName || null,
    };
  }

  /**
   * Fetch and transform activities
   */
  async getActivities(startDate, endDate) {
    const activities = await this.fetchActivities(startDate, endDate);
    return activities.map((activity) => this.transformActivity(activity));
  }
}

export default GarminClient;

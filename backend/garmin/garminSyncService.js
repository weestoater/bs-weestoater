/**
 * Garmin Connect Sync Service
 *
 * This service uses the unofficial garmin-connect library to fetch activities
 * without requiring OAuth setup. It authenticates with username/password.
 */

import pkg from "garmin-connect";
const { GarminConnect } = pkg;
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GarminSyncService {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.client = new GarminConnect({
      username: this.username,
      password: this.password,
    });
    this.isAuthenticated = false;
  }

  /**
   * Sleep for a specified duration
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Authenticate with Garmin Connect
   */
  async authenticate() {
    try {
      console.log("🔐 Authenticating with Garmin Connect...");
      await this.client.login();
      this.isAuthenticated = true;
      console.log("✅ Successfully authenticated with Garmin Connect");
    } catch (error) {
      console.error("❌ Authentication failed:", error.message);

      // Check if it's a Cloudflare block
      if (error.message && error.message.includes("cf-")) {
        throw new Error(
          "Garmin Connect blocked the request (Cloudflare protection). " +
            "Try again in a few minutes or from a different network. " +
            "Too many requests in a short time can trigger this protection.",
        );
      }

      throw new Error(
        "Garmin authentication failed. Check your credentials and try again.",
      );
    }
  }

  /**
   * Fetch GPS details for a specific activity
   * @param {string|number} activityId - Activity ID
   * @returns {Promise<Object|null>} GPS data or null if not available
   */
  async fetchActivityGPSData(activityId) {
    try {
      const details = await this.client.getActivity({ activityId });

      if (
        !details?.summaryDTO?.startLatitude ||
        !details?.summaryDTO?.startLongitude
      ) {
        return null;
      }

      const gpsData = {
        startPoint: {
          lat: details.summaryDTO.startLatitude,
          lng: details.summaryDTO.startLongitude,
        },
        endPoint:
          details.summaryDTO.endLatitude && details.summaryDTO.endLongitude
            ? {
                lat: details.summaryDTO.endLatitude,
                lng: details.summaryDTO.endLongitude,
              }
            : null,
      };

      // Extract GPS coordinates if available from samples
      if (details.geoPolylineDTO?.polyline) {
        // Polyline is typically encoded, we'll store it for decoding on frontend
        gpsData.polyline = details.geoPolylineDTO.polyline;
      }

      return gpsData;
    } catch (error) {
      console.warn(
        `⚠️  Could not fetch GPS data for activity ${activityId}:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Map Garmin activity type to our format
   */
  mapActivityType(garminType) {
    const typeMap = {
      running: "running",
      cycling: "cycling",
      walking: "walking",
      swimming: "swimming",
      treadmill_running: "running",
      road_biking: "cycling",
      mountain_biking: "cycling",
      indoor_cycling: "cycling",
      lap_swimming: "swimming",
      open_water_swimming: "swimming",
      trail_running: "running",
      street_running: "running",
      track_running: "running",
    };

    const normalizedType = (garminType || "")
      .toLowerCase()
      .replace(/\s+/g, "_");
    return typeMap[normalizedType] || "other";
  }

  /**
   * Transform Garmin activity to our format
   * @param {Object} activity - Raw Garmin activity
   * @param {Object} gpsData - Optional GPS data
   */
  transformActivity(activity, gpsData = null) {
    // Convert meters to miles
    const distanceInMiles = (activity.distance || 0) * 0.000621371;

    // Calculate average pace if available (minutes per mile)
    let averagePace = null;
    if (activity.distance && activity.duration) {
      const milesPerSecond = distanceInMiles / activity.duration;
      averagePace = milesPerSecond > 0 ? 1 / (milesPerSecond * 60) : null;
    }

    // Convert meters to feet
    const elevationInFeet = (activity.elevationGain || 0) * 3.28084;

    return {
      id: String(
        activity.activityId || activity.summaryId || `act_${Date.now()}`,
      ),
      date:
        activity.startTimeGMT ||
        activity.startTimeLocal ||
        new Date().toISOString(),
      type: this.mapActivityType(
        activity.activityType?.typeKey || activity.activityType,
      ),
      distance: parseFloat(distanceInMiles.toFixed(2)),
      duration: Math.round(activity.duration || activity.movingDuration || 0),
      calories: Math.round(activity.calories || 0),
      averageHeartRate: Math.round(activity.averageHR || 0) || null,
      maxHeartRate: Math.round(activity.maxHR || 0) || null,
      averagePace: averagePace ? parseFloat(averagePace.toFixed(2)) : null,
      elevation: elevationInFeet ? Math.round(elevationInFeet) : null,
      steps: activity.steps || null,
      notes: activity.activityName || null,
      gpsData: gpsData || null,
    };
  }

  /**
   * Fetch activities from Garmin Connect
   * @param {number} limit - Number of activities to fetch (default: 20)
   * @param {boolean} includeGPS - Whether to fetch GPS data (default: false, slower)
   * @returns {Promise<Array>} Array of transformed activities
   */
  async fetchActivities(limit = 20, includeGPS = false) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log(
        `📥 Fetching last ${limit} activities from Garmin Connect...`,
      );
      const activities = await this.client.getActivities(0, limit);

      console.log(`✅ Fetched ${activities.length} activities`);

      // Transform activities to our format
      const transformed = [];
      for (const activity of activities) {
        let gpsData = null;

        // Optionally fetch GPS data (this is slower as it requires one API call per activity)
        if (includeGPS) {
          const activityId = activity.activityId || activity.summaryId;
          if (activityId) {
            gpsData = await this.fetchActivityGPSData(activityId);
            // Small delay to avoid rate limiting
            await this.sleep(500);
          }
        }

        const transformedActivity = this.transformActivity(activity, gpsData);
        if (transformedActivity.distance > 0) {
          transformed.push(transformedActivity);
        }
      }

      if (includeGPS) {
        console.log(
          `✅ Fetched GPS data for ${transformed.filter((a) => a.gpsData).length} activities`,
        );
      }

      return transformed;
    } catch (error) {
      console.error("❌ Error fetching activities:", error.message);
      throw error;
    }
  }

  /**
   * Fetch daily steps data from Garmin Connect
   * @param {number} days - Number of days to fetch (default: 30, max handled via chunking)
   * @returns {Promise<Array>} Array of daily step records
   */
  async fetchDailySteps(days = 30) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log(`📥 Fetching last ${days} days of step data...`);

      // Format dates as YYYY-MM-DD
      const formatDate = (date) => date.toISOString().split("T")[0];

      // Garmin API has a 28-day limit per request, so chunk the requests
      const MAX_DAYS_PER_REQUEST = 28;
      const allDailySteps = [];

      let remainingDays = days;
      let currentEndDate = new Date();

      while (remainingDays > 0) {
        const daysToFetch = Math.min(remainingDays, MAX_DAYS_PER_REQUEST);
        const chunkStartDate = new Date(currentEndDate);
        chunkStartDate.setDate(chunkStartDate.getDate() - daysToFetch + 1);

        const startDateStr = formatDate(chunkStartDate);
        const endDateStr = formatDate(currentEndDate);

        console.log(
          `   Fetching ${daysToFetch} days: ${startDateStr} to ${endDateStr}`,
        );

        try {
          // Use the direct API call to get daily step data
          const response = await this.client.client.get(
            `${this.client.url.DAILY_STEPS}${startDateStr}/${endDateStr}`,
          );

          if (response && Array.isArray(response)) {
            // Transform the response data
            const chunk = response
              .filter((day) => day.calendarDate && day.totalSteps != null)
              .map((day) => {
                // Convert meters to miles if available
                const distanceInMiles = day.totalDistance
                  ? (day.totalDistance / 1609.34).toFixed(2)
                  : null;

                return {
                  date: day.calendarDate,
                  steps: day.totalSteps || 0,
                  goal: day.dailyStepGoal || day.stepGoal || null,
                  distance: distanceInMiles,
                  calories: day.totalKilocalories || day.calories || null,
                  floors: day.floorsAscended || null,
                  activeMinutes:
                    day.activeMinutes || day.moderateIntensityMinutes || null,
                };
              });

            allDailySteps.push(...chunk);
          }
        } catch (chunkError) {
          console.warn(`⚠️  Error fetching chunk: ${chunkError.message}`);
        }

        // Move to the next chunk
        remainingDays -= daysToFetch;
        currentEndDate.setDate(currentEndDate.getDate() - daysToFetch);

        // Add a small delay between chunks to avoid rate limiting
        if (remainingDays > 0) {
          await this.sleep(1000); // Wait 1 second between chunks
        }
      }

      // Sort by date descending and remove duplicates
      const uniqueSteps = Array.from(
        new Map(allDailySteps.map((item) => [item.date, item])).values(),
      ).sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log(`✅ Fetched ${uniqueSteps.length} days of step data`);
      return uniqueSteps;
    } catch (error) {
      console.error("❌ Error fetching daily steps:", error.message);
      throw error;
    }
  }

  /**
   * Save daily steps to JSON file
   * @param {Array} dailySteps - Daily steps to save
   * @param {string} outputPath - Path to save the JSON file
   */
  async saveDailySteps(dailySteps, outputPath = null) {
    const filePath =
      outputPath || path.resolve(__dirname, "../../src/data/dailySteps.json");

    try {
      // Sort by date (most recent first)
      const sorted = dailySteps.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      await fs.writeFile(filePath, JSON.stringify(sorted, null, 2), "utf8");

      console.log(
        `✅ Saved ${dailySteps.length} daily step records to ${filePath}`,
      );
      return filePath;
    } catch (error) {
      console.error("❌ Error saving daily steps:", error.message);
      throw error;
    }
  }

  /**
   * Save daily steps to Supabase
   * @param {Array} dailySteps - Daily steps to save
   * @param {Object} supabaseClient - Supabase client instance
   * @returns {Promise<Array>} Saved daily steps
   */
  async saveDailyStepsToSupabase(dailySteps, supabaseClient) {
    try {
      // Import the service dynamically
      const { createDailyStepsService } =
        await import("../supabase/dailyStepsDatabase.js");
      const stepsService = createDailyStepsService(supabaseClient);

      console.log(
        `📤 Upserting ${dailySteps.length} daily step records to Supabase...`,
      );

      const result = await stepsService.upsertDailySteps(dailySteps);

      console.log(`✅ Saved ${result.length} daily step records to Supabase`);
      return result;
    } catch (error) {
      console.error("❌ Error saving daily steps to Supabase:", error.message);
      throw error;
    }
  }

  /**
   * Sync daily steps from Garmin Connect
   * @param {number} days - Number of days to fetch
   * @param {Object} options - Sync options
   * @param {boolean} [options.saveToJson=true] - Save to JSON file
   * @param {Object} [options.supabaseClient] - Supabase client for database sync
   * @returns {Promise<Object>} Sync result with statistics
   */
  async syncDailySteps(days = 30, options = {}) {
    const { saveToJson = true, supabaseClient = null } = options;
    const startTime = Date.now();

    try {
      // Fetch daily steps
      const dailySteps = await this.fetchDailySteps(days);

      let filePath = null;
      let supabaseSaved = false;

      // Save to file if enabled
      if (saveToJson) {
        filePath = await this.saveDailySteps(dailySteps);
      }

      // Save to Supabase if client provided
      if (supabaseClient) {
        await this.saveDailyStepsToSupabase(dailySteps, supabaseClient);
        supabaseSaved = true;
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      const totalSteps = dailySteps.reduce((sum, d) => sum + d.steps, 0);
      const avgSteps = Math.round(totalSteps / dailySteps.length);

      const result = {
        success: true,
        daysCount: dailySteps.length,
        duration: `${duration}s`,
        filePath,
        supabaseSaved,
        summary: {
          totalSteps: totalSteps.toLocaleString(),
          avgSteps: avgSteps.toLocaleString(),
        },
      };

      console.log("\n📊 Daily Steps Sync Summary:");
      console.log(`   Days synced: ${result.daysCount}`);
      console.log(`   Total steps: ${result.summary.totalSteps}`);
      console.log(`   Average steps/day: ${result.summary.avgSteps}`);
      console.log(`   Duration: ${result.duration}`);
      if (supabaseSaved) {
        console.log("   ✅ Saved to Supabase");
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      };
    }
  }

  /**
   * Save activities to JSON file
   * @param {Array} activities - Activities to save
   * @param {string} outputPath - Path to save the JSON file
   */
  async saveActivities(activities, outputPath = null) {
    const filePath =
      outputPath ||
      path.resolve(__dirname, "../../src/data/garminActivities.json");

    try {
      // Sort by date (most recent first)
      const sorted = activities.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      await fs.writeFile(filePath, JSON.stringify(sorted, null, 2), "utf8");

      console.log(`✅ Saved ${activities.length} activities to ${filePath}`);
      return filePath;
    } catch (error) {
      console.error("❌ Error saving activities:", error.message);
      throw error;
    }
  }

  /**
   * Save activities to Supabase
   * @param {Array} activities - Activities to save
   * @param {Object} supabaseClient - Supabase client instance
   * @returns {Promise<Array>} Saved activities
   */
  async saveToSupabase(activities, supabaseClient) {
    try {
      // Import the service dynamically
      const { createGarminActivitiesService } =
        await import("../supabase/garminActivitiesDatabase.js");
      const garminService = createGarminActivitiesService(supabaseClient);

      console.log(
        `📤 Upserting ${activities.length} activities to Supabase...`,
      );

      const result = await garminService.upsertActivities(activities);

      console.log(`✅ Saved ${result.length} activities to Supabase`);
      return result;
    } catch (error) {
      console.error("❌ Error saving to Supabase:", error.message);
      throw error;
    }
  }

  /**
   * Sync activities from Garmin Connect
   * @param {number} limit - Number of activities to fetch
   * @param {Object} options - Sync options
   * @param {boolean} [options.saveToJson=true] - Save to JSON file
   * @param {boolean} [options.includeGPS=false] - Fetch GPS data (slower)
   * @param {Object} [options.supabaseClient] - Supabase client for database sync
   * @returns {Promise<Object>} Sync result with statistics
   */
  async syncActivities(limit = 20, options = {}) {
    const {
      saveToJson = true,
      includeGPS = false,
      supabaseClient = null,
    } = options;
    const startTime = Date.now();

    try {
      // Fetch activities
      const activities = await this.fetchActivities(limit, includeGPS);

      let filePath = null;
      let supabaseSaved = false;

      // Save to file if enabled
      if (saveToJson) {
        filePath = await this.saveActivities(activities);
      }

      // Save to Supabase if client provided
      if (supabaseClient) {
        await this.saveToSupabase(activities, supabaseClient);
        supabaseSaved = true;
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      const result = {
        success: true,
        activitiesCount: activities.length,
        duration: `${duration}s`,
        filePath,
        supabaseSaved,
        summary: {
          totalDistance: activities
            .reduce((sum, a) => sum + a.distance, 0)
            .toFixed(2),
          totalDuration: activities.reduce((sum, a) => sum + a.duration, 0),
          totalCalories: activities.reduce((sum, a) => sum + a.calories, 0),
          activityTypes: [...new Set(activities.map((a) => a.type))],
        },
      };

      console.log("\n📊 Sync Summary:");
      console.log(`   Activities synced: ${result.activitiesCount}`);
      console.log(`   Total distance: ${result.summary.totalDistance} miles`);
      console.log(`   Duration: ${result.duration}`);
      console.log(
        `   Activity types: ${result.summary.activityTypes.join(", ")}`,
      );
      if (supabaseSaved) {
        console.log("   ✅ Saved to Supabase");
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      };
    }
  }
}

export default GarminSyncService;

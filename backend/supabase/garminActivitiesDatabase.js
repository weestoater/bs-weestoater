/**
 * Garmin Activities Database Operations
 * Provides database access layer for Garmin Connect activities
 * This module can be used with any Supabase client instance
 */

/**
 * Creates garmin activities database service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Database service methods
 */
export function createGarminActivitiesService(supabaseClient) {
  /**
   * Get all activities
   * @param {Object} options - Query options
   * @param {number} [options.limit=50] - Maximum number of activities to return
   * @param {string} [options.type] - Filter by activity type
   * @param {Date} [options.startDate] - Filter activities after this date
   * @param {Date} [options.endDate] - Filter activities before this date
   * @returns {Promise<Array>} Array of activity objects
   */
  async function getActivities(options = {}) {
    const { limit = 50, type, startDate, endDate } = options;

    let query = supabaseClient
      .from("garmin_activities")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    if (startDate) {
      query = query.gte("date", startDate.toISOString());
    }

    if (endDate) {
      query = query.lte("date", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single activity by ID
   * @param {string} id - Activity ID
   * @returns {Promise<Object|null>} Activity object or null if not found
   */
  async function getActivityById(id) {
    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      console.error("Error fetching activity:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new activity
   * @param {Object} activityData
   * @param {string} activityData.id - Unique activity ID
   * @param {string} activityData.date - Activity date (ISO string)
   * @param {string} activityData.type - Activity type (running, cycling, walking, swimming, other)
   * @param {number} activityData.distance - Distance in miles
   * @param {number} activityData.duration - Duration in seconds
   * @param {number} [activityData.calories] - Calories burned
   * @param {number} [activityData.averageHeartRate] - Average heart rate
   * @param {number} [activityData.maxHeartRate] - Max heart rate
   * @param {number} [activityData.averagePace] - Average pace in minutes per mile
   * @param {number} [activityData.elevation] - Elevation gain in feet
   * @param {number} [activityData.steps] - Step count
   * @param {string} [activityData.notes] - Activity notes
   * @returns {Promise<Object>} The created activity
   */
  async function createActivity(activityData) {
    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .insert([
        {
          id: activityData.id,
          date: activityData.date,
          type: activityData.type,
          distance: activityData.distance,
          duration: activityData.duration,
          calories: activityData.calories || null,
          average_heart_rate: activityData.averageHeartRate || null,
          max_heart_rate: activityData.maxHeartRate || null,
          average_pace: activityData.averagePace || null,
          elevation: activityData.elevation || null,
          steps: activityData.steps || null,
          notes: activityData.notes || null,
          gps_data: activityData.gpsData || null,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating activity:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Create multiple activities (bulk insert)
   * @param {Array<Object>} activities - Array of activity data objects
   * @returns {Promise<Array>} Array of created activities
   */
  async function createActivities(activities) {
    const activitiesToInsert = activities.map((activity) => ({
      id: activity.id,
      date: activity.date,
      type: activity.type,
      distance: activity.distance,
      duration: activity.duration,
      calories: activity.calories || null,
      average_heart_rate: activity.averageHeartRate || null,
      max_heart_rate: activity.maxHeartRate || null,
      average_pace: activity.averagePace || null,
      elevation: activity.elevation || null,
      steps: activity.steps || null,
      notes: activity.notes || null,
      gps_data: activity.gpsData || null,
    }));

    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .insert(activitiesToInsert)
      .select();

    if (error) {
      console.error("Error creating activities:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing activity
   * @param {string} id - Activity ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated activity
   */
  async function updateActivity(id, updates) {
    const updateData = {};

    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.distance !== undefined) updateData.distance = updates.distance;
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.calories !== undefined) updateData.calories = updates.calories;
    if (updates.averageHeartRate !== undefined)
      updateData.average_heart_rate = updates.averageHeartRate;
    if (updates.maxHeartRate !== undefined)
      updateData.max_heart_rate = updates.maxHeartRate;
    if (updates.averagePace !== undefined)
      updateData.average_pace = updates.averagePace;
    if (updates.elevation !== undefined)
      updateData.elevation = updates.elevation;
    if (updates.steps !== undefined) updateData.steps = updates.steps;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating activity:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Upsert activities (insert or update if exists)
   * @param {Array<Object>} activities - Array of activity data
   * @returns {Promise<Array>} Array of upserted activities
   */
  async function upsertActivities(activities) {
    const activitiesToUpsert = activities.map((activity) => ({
      id: activity.id,
      date: activity.date,
      type: activity.type,
      distance: activity.distance,
      duration: activity.duration,
      calories: activity.calories || null,
      average_heart_rate: activity.averageHeartRate || null,
      max_heart_rate: activity.maxHeartRate || null,
      average_pace: activity.averagePace || null,
      elevation: activity.elevation || null,
      steps: activity.steps || null,
      notes: activity.notes || null,
      gps_data: activity.gpsData || null,
    }));

    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .upsert(activitiesToUpsert, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Error upserting activities:", error);
      throw error;
    }

    return data;
  }

  /**
   * Delete an activity
   * @param {string} id - Activity ID
   * @returns {Promise<void>}
   */
  async function deleteActivity(id) {
    const { error } = await supabaseClient
      .from("garmin_activities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }

  /**
   * Get activity summary statistics
   * @returns {Promise<Object>} Summary statistics
   */
  async function getActivitySummary() {
    const { data, error } = await supabaseClient
      .from("garmin_activity_summary")
      .select("*");

    if (error) {
      console.error("Error fetching activity summary:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get recent activities (last 30 days)
   * @returns {Promise<Array>} Array of recent activities
   */
  async function getRecentActivities() {
    const { data, error } = await supabaseClient
      .from("garmin_recent_activities")
      .select("*");

    if (error) {
      console.error("Error fetching recent activities:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get monthly activity totals
   * @returns {Promise<Array>} Array of monthly totals
   */
  async function getMonthlyTotals() {
    const { data, error } = await supabaseClient
      .from("garmin_monthly_totals")
      .select("*");

    if (error) {
      console.error("Error fetching monthly totals:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get total statistics for all activities
   * @returns {Promise<Object>} Total statistics
   */
  async function getTotalStatistics() {
    const { data, error } = await supabaseClient
      .from("garmin_activities")
      .select("distance, duration, calories, steps");

    if (error) {
      console.error("Error fetching total statistics:", error);
      throw error;
    }

    const totals = data.reduce(
      (acc, activity) => ({
        totalActivities: acc.totalActivities + 1,
        totalDistance: acc.totalDistance + (parseFloat(activity.distance) || 0),
        totalDuration: acc.totalDuration + (parseInt(activity.duration) || 0),
        totalCalories: acc.totalCalories + (parseInt(activity.calories) || 0),
        totalSteps: acc.totalSteps + (parseInt(activity.steps) || 0),
      }),
      {
        totalActivities: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        totalSteps: 0,
      },
    );

    return totals;
  }

  // Return all service methods
  return {
    getActivities,
    getActivityById,
    createActivity,
    createActivities,
    updateActivity,
    upsertActivities,
    deleteActivity,
    getActivitySummary,
    getRecentActivities,
    getMonthlyTotals,
    getTotalStatistics,
  };
}

// Default export for backwards compatibility
export default createGarminActivitiesService;

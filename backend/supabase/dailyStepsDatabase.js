/**
 * Daily Steps Database Service
 *
 * This service provides CRUD operations for daily step data in Supabase.
 */

/**
 * Create a daily steps service with the given Supabase client
 * @param {Object} supabaseClient - Initialized Supabase client
 * @returns {Object} Service object with methods
 */
export function createDailyStepsService(supabaseClient) {
  /**
   * Get daily steps records
   * @param {Object} options - Query options
   * @param {number} [options.limit=30] - Max number of records to return
   * @param {string} [options.startDate] - Start date (YYYY-MM-DD)
   * @param {string} [options.endDate] - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of daily step records
   */
  async function getDailySteps(options = {}) {
    const { limit = 30, startDate, endDate } = options;

    let query = supabaseClient
      .from("daily_steps")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);

    if (startDate) {
      query = query.gte("date", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching daily steps:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a single day's steps
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object|null>} Daily step record or null
   */
  async function getDaySteps(date) {
    const { data, error } = await supabaseClient
      .from("daily_steps")
      .select("*")
      .eq("date", date)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching day steps:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a daily step record
   * @param {Object} dayData - Daily step data
   * @param {string} dayData.date - Date (YYYY-MM-DD)
   * @param {number} dayData.steps - Step count
   * @param {number} [dayData.goal] - Step goal
   * @param {number} [dayData.distance] - Distance in miles
   * @param {number} [dayData.calories] - Calories burned
   * @param {number} [dayData.floors] - Floors climbed
   * @param {number} [dayData.activeMinutes] - Active minutes
   * @returns {Promise<Object>} The created record
   */
  async function createDaySteps(dayData) {
    const { data, error } = await supabaseClient
      .from("daily_steps")
      .insert([
        {
          date: dayData.date,
          steps: dayData.steps,
          goal: dayData.goal || null,
          distance: dayData.distance || null,
          calories: dayData.calories || null,
          floors: dayData.floors || null,
          active_minutes: dayData.activeMinutes || null,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating day steps:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update a daily step record
   * @param {string} date - Date to update (YYYY-MM-DD)
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated record
   */
  async function updateDaySteps(date, updates) {
    const updateData = {};

    if (updates.steps !== undefined) updateData.steps = updates.steps;
    if (updates.goal !== undefined) updateData.goal = updates.goal;
    if (updates.distance !== undefined) updateData.distance = updates.distance;
    if (updates.calories !== undefined) updateData.calories = updates.calories;
    if (updates.floors !== undefined) updateData.floors = updates.floors;
    if (updates.activeMinutes !== undefined)
      updateData.active_minutes = updates.activeMinutes;

    const { data, error } = await supabaseClient
      .from("daily_steps")
      .update(updateData)
      .eq("date", date)
      .select();

    if (error) {
      console.error("Error updating day steps:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Upsert daily step records (insert or update if exists)
   * @param {Array<Object>} dailySteps - Array of daily step data
   * @returns {Promise<Array>} Array of upserted records
   */
  async function upsertDailySteps(dailySteps) {
    const stepsToUpsert = dailySteps.map((day) => ({
      date: day.date,
      steps: day.steps,
      goal: day.goal || null,
      distance: day.distance || null,
      calories: day.calories || null,
      floors: day.floors || null,
      active_minutes: day.activeMinutes || null,
    }));

    const { data, error } = await supabaseClient
      .from("daily_steps")
      .upsert(stepsToUpsert, { onConflict: "date" })
      .select();

    if (error) {
      console.error("Error upserting daily steps:", error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a daily step record
   * @param {string} date - Date to delete (YYYY-MM-DD)
   * @returns {Promise<void>}
   */
  async function deleteDaySteps(date) {
    const { error } = await supabaseClient
      .from("daily_steps")
      .delete()
      .eq("date", date);

    if (error) {
      console.error("Error deleting day steps:", error);
      throw error;
    }
  }

  /**
   * Get summary statistics
   * @returns {Promise<Object>} Summary statistics
   */
  async function getSummaryStats() {
    const { data, error } = await supabaseClient
      .from("daily_steps_summary")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching summary stats:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get recent 30 days
   * @returns {Promise<Array>} Recent 30 days of data
   */
  async function getRecent30Days() {
    const { data, error } = await supabaseClient
      .from("daily_steps_recent_30")
      .select("*");

    if (error) {
      console.error("Error fetching recent 30 days:", error);
      throw error;
    }

    return data || [];
  }

  return {
    getDailySteps,
    getDaySteps,
    createDaySteps,
    updateDaySteps,
    upsertDailySteps,
    deleteDaySteps,
    getSummaryStats,
    getRecent30Days,
  };
}

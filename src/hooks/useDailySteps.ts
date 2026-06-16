import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../backend/index.js";
import { DailySteps } from "../interfaces/DailySteps";

function getSupabase() {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
}

const supabase = getSupabase();

interface UseDailyStepsOptions {
  limit?: number;
  startDate?: string;
  endDate?: string;
  fallbackData?: DailySteps[];
}

interface UseDailyStepsResult {
  dailySteps: DailySteps[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch daily steps from Supabase database
 * Returns empty array if database is not configured or on error
 */
export function useDailySteps(
  options: UseDailyStepsOptions = {},
): UseDailyStepsResult {
  const { limit = 30, startDate, endDate, fallbackData = [] } = options;
  const [dailySteps, setDailySteps] = useState<DailySteps[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDailySteps = async () => {
    // If Supabase is not configured, return empty data
    if (!supabase) {
      console.log("Supabase not configured for daily steps");
      setDailySteps([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("daily_steps")
        .select("date,steps,goal,distance,calories,floors,active_minutes")
        .order("date", { ascending: false })
        .limit(limit);

      if (startDate) {
        query = query.gte("date", startDate);
      }

      if (endDate) {
        query = query.lte("date", endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform database format to match DailySteps interface
      type RawStepsRow = {
        date: string;
        steps: number;
        goal: number;
        distance: number;
        calories: number;
        floors: number;
        active_minutes: number;
      };
      const transformedSteps: DailySteps[] = (data || []).map(
        (item: RawStepsRow) => ({
          date: item.date,
          steps: item.steps,
          goal: item.goal,
          distance: item.distance,
          calories: item.calories,
          floors: item.floors,
          activeMinutes: item.active_minutes,
        }),
      );

      setDailySteps(transformedSteps);
    } catch (err) {
      console.error("Error fetching daily steps from Supabase:", err);
      setError(err as Error);
      // Return empty array on error
      setDailySteps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, startDate, endDate]);

  return {
    dailySteps,
    loading,
    error,
    refetch: fetchDailySteps,
  };
}

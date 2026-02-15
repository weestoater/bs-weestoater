import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { GarminActivity } from "../interfaces/GarminActivity";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface UseGarminActivitiesOptions {
  limit?: number;
  type?: string;
  fallbackData?: GarminActivity[];
}

interface UseGarminActivitiesResult {
  activities: GarminActivity[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Garmin activities from Supabase
 * Falls back to JSON data if Supabase is not configured
 */
export function useGarminActivities(
  options: UseGarminActivitiesOptions = {},
): UseGarminActivitiesResult {
  const { limit = 50, type, fallbackData = [] } = options;
  const [activities, setActivities] = useState<GarminActivity[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    // If Supabase is not configured, use fallback data
    if (!supabase) {
      console.log("Supabase not configured, using fallback data");
      setActivities(fallbackData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("garmin_activities")
        .select("*")
        .order("date", { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform database format to match GarminActivity interface
      const transformedActivities: GarminActivity[] = (data || []).map(
        (item: any) => ({
          id: item.id,
          date: item.date,
          type: item.type,
          distance: parseFloat(item.distance),
          duration: item.duration,
          calories: item.calories,
          averageHeartRate: item.average_heart_rate,
          maxHeartRate: item.max_heart_rate,
          averagePace: item.average_pace
            ? parseFloat(item.average_pace)
            : undefined,
          elevation: item.elevation,
          steps: item.steps,
          notes: item.notes,
          gpsData: item.gps_data,
        }),
      );

      setActivities(transformedActivities);
    } catch (err) {
      console.error("Error fetching activities from Supabase:", err);
      setError(err as Error);
      // Fall back to provided data on error
      setActivities(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit, type]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
}

/**
 * Hook to fetch activity summary statistics
 */
export function useGarminActivityStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("garmin_activity_summary")
          .select("*");

        if (fetchError) throw fetchError;

        setStats(data);
      } catch (err) {
        console.error("Error fetching activity stats:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export default useGarminActivities;

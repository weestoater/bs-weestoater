import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../backend/index.js";
import { GarminActivity } from "../interfaces/GarminActivity";

function getSupabase() {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
}

const supabase = getSupabase();

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
        .select(
          "id,date,type,distance,duration,calories,average_heart_rate,max_heart_rate,average_pace,elevation,steps,notes,gps_data",
        )
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
      type RawActivityRow = {
        id: string;
        date: string;
        type: string;
        distance: string;
        duration: number;
        calories: number;
        average_heart_rate: number;
        max_heart_rate: number;
        average_pace: string | null;
        elevation: number;
        steps: number;
        notes: string | null;
        gps_data: unknown;
      };
      const transformedActivities: GarminActivity[] = (data || []).map(
        (item: RawActivityRow) => ({
          id: item.id,
          date: item.date,
          type: item.type as GarminActivity["type"],
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
          notes: item.notes ?? undefined,
          gpsData: item.gps_data ?? undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const [stats, setStats] = useState<unknown>(null);
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

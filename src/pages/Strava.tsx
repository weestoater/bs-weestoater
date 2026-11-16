import { useCallback, useEffect, useMemo, useState } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";

import { StravaActivityCard } from "../components/strava/StravaActivityCard";
import {
  fetchStravaActivities,
  isStravaAdmin,
  triggerStravaSync,
} from "../utils/stravaApi";

import type { StravaActivity } from "../interfaces/StravaActivity";
import { getActivityCategory } from "../utils/stravaActivityType";

const METERS_PER_MILE = 1609.344;

export const StravaPage = () => {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadActivities = useCallback(
    () =>
      fetchStravaActivities()
        .then(setActivities)
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load Strava activities");
        }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    loadActivities().finally(() => {
      if (!cancelled) setLoading(false);
    });
    isStravaAdmin().then((admin) => {
      if (!cancelled) setIsAdmin(admin);
    });
    return () => {
      cancelled = true;
    };
  }, [loadActivities]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await triggerStravaSync();
      setSyncMessage(
        `Synced ${result.activities} activities, fetched ${result.detailsFetched} new details.${
          result.rateLimited ? " Strava rate limit reached; run again later for the rest." : ""
        }`,
      );
      await loadActivities();
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const activityTypes = useMemo(() => {
    const counts = new Map<string, { label: string; icon: string; colorClass: string; count: number }>();
    activities.forEach((activity) => {
      const category = getActivityCategory(activity.sportType);
      const entry = counts.get(category.key);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(category.key, { ...category, count: 1 });
      }
    });
    return [...counts.entries()].sort(([, a], [, b]) => b.count - a.count);
  }, [activities]);

  const visibleActivities = useMemo(
    () =>
      selectedActivityTypes.length === 0
        ? activities
        : activities.filter((activity) =>
            selectedActivityTypes.includes(getActivityCategory(activity.sportType).key),
          ),
    [activities, selectedActivityTypes],
  );

  const totals = useMemo(() => {
    const totalMeters = activities.reduce((sum, a) => sum + a.distanceM, 0);
    const totalSeconds = activities.reduce((sum, a) => sum + a.movingTimeS, 0);
    const totalCalories = activities.reduce((sum, a) => sum + (a.calories ?? 0), 0);
    return {
      count: activities.length,
      miles: totalMeters / METERS_PER_MILE,
      minutes: totalSeconds / 60,
      calories: Math.round(totalCalories),
    };
  }, [activities]);

  const formatDistance = (miles: number | null, metric: boolean): string => {
    if (miles === null) return "N/A";
    if (metric) {
      const km = miles * 1.60934;
      return `${km.toFixed(1)} km`;
    }
    return `${miles.toFixed(1)} mi`;
  };

  const formatSpeed = (mph: number | null, metric: boolean): string => {
    if (mph === null) return "N/A";
    if (metric) {
      const kmh = mph * 1.60934;
      return `${kmh.toFixed(1)} km/h`;
    }
    return `${mph.toFixed(1)} mph`;
  };

  const formatDuration = (minutes: number | null): string => {
    if (minutes === null) return "N/A";
    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatActivityDateTime = (startDateLocal: string): string => {
    // start_date_local is the athlete's local wall-clock time, marked with a trailing Z,
    // so it is formatted in UTC to show the original time unchanged.
    const date = new Date(startDateLocal);
    if (Number.isNaN(date.getTime())) return startDateLocal;

    const weekday = date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
    const month = date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${weekday}, ${day} ${month} ${year} at ${hours}:${minutes}`;
  };

  return (
    <>
      <PageTitleH1
        title="Strava Activities"
        description="Strava activities, workouts, and training history."
        keywords="Strava, activities, training, workouts"
      />

      {isAdmin && (
        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSync}
            disabled={syncing}
          >
            <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
            {syncing ? "Syncing…" : "Sync from Strava"}
          </button>
          {syncMessage && <p role="status" className="mb-0">{syncMessage}</p>}
        </div>
      )}

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary */}
          <section aria-labelledby="strava-summary-heading" className="mb-4">
            <h2 id="strava-summary-heading" className="h5 mb-3">Summary</h2>
            <dl className="row text-center mb-0">
              <div className="col-6 col-md-3 mb-3">
                <dt className="fs-6 text-muted">Activities</dt>
                <dd className="fs-4 fw-bold mb-0">{totals.count}</dd>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <dt className="fs-6 text-muted">Total Distance</dt>
                <dd className="fs-4 fw-bold mb-0">{formatDistance(totals.miles, false)}</dd>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <dt className="fs-6 text-muted">Total Time</dt>
                <dd className="fs-4 fw-bold mb-0">{formatDuration(totals.minutes)}</dd>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <dt className="fs-6 text-muted">Total Calories</dt>
                <dd className="fs-4 fw-bold mb-0">{totals.calories.toLocaleString("en-GB")} kcal</dd>
              </div>
            </dl>
          </section>

          {/* Activity Type Filter */}
          {Object.keys(activityTypes).length > 0 && (
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="bi bi-funnel me-2"></i>
                Filter by Activity Type
              </h6>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${
                    selectedActivityTypes.length === 0
                      ? "btn-secondary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setSelectedActivityTypes([])}
                  title="Show all activities"
                >
                  <i className="bi bi-funnel me-1"></i>
                  All Types ({activities.length})
                </button>
                {activityTypes.map(([key, type]) => {
                  const selected = selectedActivityTypes.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      className={`btn btn-sm ${
                        selected ? `${type.colorClass} text-white` : `btn-outline-secondary`
                      }`}
                      onClick={() => {
                        setSelectedActivityTypes((prev) =>
                          prev.includes(key)
                            ? prev.filter((t) => t !== key)
                            : [...prev, key],
                        );
                      }}
                      title={`${type.label} activities (${type.count})`}
                    >
                      <i className={`bi ${type.icon} me-1`} aria-hidden="true"></i>
                      {type.label} ({type.count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activities List */}
          <p role="status" className="mb-4">
            {visibleActivities.length} Strava{" "}
            {selectedActivityTypes.length > 0
              ? `${activityTypes
                  .filter(([key]) => selectedActivityTypes.includes(key))
                  .map(([, type]) => type.label)
                  .join("/")} `
              : ""}
            {visibleActivities.length === 1 ? "activity" : "activities"} found.
          </p>

          <div className="row g-3">
            {visibleActivities.map((activity) => (
              <StravaActivityCard
                key={activity.id}
                activity={activity}
                useMetric={false}
                formatDistance={formatDistance}
                formatSpeed={formatSpeed}
                formatDuration={formatDuration}
                formatActivityDateTime={formatActivityDateTime}
              />
            ))}
          </div>
        </>
      )}

      <BackToTop />
    </>
  );
};

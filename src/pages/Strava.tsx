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
import {
  countActivityTypes,
  filterActivitiesByType,
} from "../utils/stravaActivityType";
import {
  DATE_RANGE_OPTIONS,
  filterActivitiesByDateRange,
  type DateRangeValue,
} from "../utils/stravaDateRange";
import { formatDistance, formatDuration } from "../utils/stravaFormat";
import { summarizeActivities } from "../utils/stravaStats";

export const StravaPage = () => {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeValue>("all");
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

  const activityTypes = useMemo(() => countActivityTypes(activities), [activities]);

  const visibleActivities = useMemo(
    () =>
      filterActivitiesByDateRange(
        filterActivitiesByType(activities, selectedActivityTypes),
        dateRange,
      ),
    [activities, selectedActivityTypes, dateRange],
  );

  const totals = useMemo(() => summarizeActivities(visibleActivities), [visibleActivities]);

  return (
    <>
      <PageTitleH1
        title="Strava Activities"
        description="Strava activities, workouts, and training history."
        keywords="Strava, activities, training, workouts"
      />

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
            <h2 id="strava-summary-heading" className="mb-1">Summary</h2>
            <dl className="row g-3 mb-0">
              <div className="col-6 col-md-3">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-activity text-success strava-summary-icon d-block mb-2" aria-hidden="true"></i>
                    <dt className="small text-muted">Activities</dt>
                    <dd className="fs-4 fw-bold mb-0">{totals.count}</dd>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-signpost-2 text-info strava-summary-icon d-block mb-2" aria-hidden="true"></i>
                    <dt className="small text-muted">Total Distance</dt>
                    <dd className="fs-4 fw-bold mb-0">{formatDistance(totals.miles, false)}</dd>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-clock text-warning strava-summary-icon d-block mb-2" aria-hidden="true"></i>
                    <dt className="small text-muted">Total Time</dt>
                    <dd className="fs-4 fw-bold mb-0">{formatDuration(totals.minutes)}</dd>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className="bi bi-fire text-danger strava-summary-icon d-block mb-2" aria-hidden="true"></i>
                    <dt className="small text-muted">Total Calories</dt>
                    <dd className="fs-4 fw-bold mb-0">{totals.calories.toLocaleString("en-GB")} kcal</dd>
                  </div>
                </div>
              </div>
            </dl>
          </section>

          {/* Filter and sync row */}
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
            {activityTypes.length > 0 && (
              <div className="flex-grow-1">
                <p className="small text-muted fw-semibold text-uppercase mb-2">
                  <i className="bi bi-funnel me-2" aria-hidden="true"></i>
                  Filter by activity
                </p>
                <div role="group" aria-label="Filter by activity type" className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={selectedActivityTypes.length === 0}
                    className={`btn rounded-pill px-3 fw-semibold ${
                      selectedActivityTypes.length === 0
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                    onClick={() => setSelectedActivityTypes([])}
                    title="Show all activities"
                  >
                    All Types ({activities.length})
                  </button>
                  {activityTypes.map(([key, type]) => {
                    const selected = selectedActivityTypes.includes(key);
                    const onColor = type.colorClass.includes("text-") ? "" : "text-white";
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        className={`btn rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-2 ${
                          selected
                            ? `${type.colorClass} ${onColor} border-0 shadow-sm`
                            : "btn-light border border-2"
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
                        {selected ? (
                          <i className="bi bi-check-lg" aria-hidden="true"></i>
                        ) : (
                          <span className={`badge rounded-pill ${type.colorClass} ${onColor}`}>
                            <i className={`bi ${type.icon}`} aria-hidden="true"></i>
                          </span>
                        )}
                        {type.label} ({type.count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activities.length > 0 && (
              <div className="flex-shrink-0">
                <label
                  htmlFor="strava-date-range"
                  className="small text-muted fw-semibold text-uppercase mb-2 d-block"
                >
                  <i className="bi bi-calendar3 me-2" aria-hidden="true"></i>
                  Date range
                </label>
                <select
                  id="strava-date-range"
                  className="form-select rounded-pill fw-semibold"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRangeValue)}
                >
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isAdmin && (
              <div className="ms-auto text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
                  {syncing ? "Syncing…" : "Sync from Strava"}
                </button>
              </div>
            )}
          </div>

          {isAdmin && syncMessage && (
            <p role="status" className="mb-4">{syncMessage}</p>
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
              <StravaActivityCard key={activity.id} activity={activity} />

            ))}
          </div>
        </>
      )}

      <BackToTop />
    </>
  );
};

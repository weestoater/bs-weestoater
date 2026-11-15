import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { getSupabaseClient } from "../../backend/index.js";
import type { Article } from "../interfaces/Article";

const { createDatabaseService } = await import("../../backend/index.js");

interface ActivityStats {
  totalActivities: number;
  totalDistance: number; // in miles
  totalDuration: number; // in minutes
  totalCalories: number;
  activityTypes: { [key: string]: number };
}

interface ExtractedMetrics {
  distance: number | null; // in miles
  duration: number | null; // in minutes
  elevation: number | null; // in feet
  avgSpeed: number | null; // mph
  avgHR: number | null;
  maxHR: number | null;
  calories: number | null;
  type: string;
}

export const StravaPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [useMetric, setUseMetric] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const client = getSupabaseClient();
        const db = createDatabaseService(client);
        const data = await db.getArticles({ category: "Strava" });
        setArticles(data || []);

        // Calculate stats from articles
        if (data && data.length > 0) {
          calculateStats(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load articles",
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const calculateStats = (articles: Article[]) => {
    let totalDistance = 0;
    let totalDuration = 0;
    let totalCalories = 0;
    const activityTypes: { [key: string]: number } = {};

    articles.forEach((article) => {
      // Extract metrics from excerpt: "X.Xmi (Y.Ykm) in ZZmin"
      const excerptMatch = article.excerpt?.match(
        /(\d+\.?\d*)mi \([\d.]+km\) in (\d+)min/,
      );
      if (excerptMatch) {
        totalDistance += parseFloat(excerptMatch[1]);
        totalDuration += parseInt(excerptMatch[2]);
      }

      // Extract calories from content
      if (article.content?.includes("Calories")) {
        const caloriesMatch = article.content.match(
          /<p><strong>Calories:<\/strong> (\d+)<\/p>/,
        );
        if (caloriesMatch) {
          totalCalories += parseInt(caloriesMatch[1]);
        }
      }

      // Count activity types from tags
      if (article.tags && article.tags.length > 0) {
        const type = article.tags[0];
        activityTypes[type] = (activityTypes[type] || 0) + 1;
      }
    });

    setStats({
      totalActivities: articles.length,
      totalDistance,
      totalDuration,
      totalCalories,
      activityTypes,
    });
  };

  const extractMetrics = (article: Article): ExtractedMetrics => {
    const metrics: ExtractedMetrics = {
      distance: null,
      duration: null,
      elevation: null,
      avgSpeed: null,
      avgHR: null,
      maxHR: null,
      calories: null,
      type: article.tags?.[0] || "Activity",
    };

    if (article.excerpt) {
      const distMatch = article.excerpt.match(/(\d+\.?\d*)mi/);
      if (distMatch) metrics.distance = parseFloat(distMatch[1]);

      const durationMatch = article.excerpt.match(/in (\d+)min/);
      if (durationMatch) metrics.duration = parseInt(durationMatch[1]);

      const elevMatch = article.excerpt.match(/\+(\d+)ft/);
      if (elevMatch) metrics.elevation = parseInt(elevMatch[1]);
    }

    if (article.content) {
      const speedMatch = article.content.match(
        /<p><strong>Average Speed:<\/strong> ([\d.]+) mph/,
      );
      if (speedMatch) metrics.avgSpeed = parseFloat(speedMatch[1]);

      const avgHRMatch = article.content.match(
        /<p><strong>Average Heart Rate:<\/strong> (\d+) bpm/,
      );
      if (avgHRMatch) metrics.avgHR = parseInt(avgHRMatch[1]);

      const maxHRMatch = article.content.match(
        /<p><strong>Max Heart Rate:<\/strong> (\d+) bpm/,
      );
      if (maxHRMatch) metrics.maxHR = parseInt(maxHRMatch[1]);

      const caloriesMatch = article.content.match(
        /<p><strong>Calories:<\/strong> (\d+)<\/p>/,
      );
      if (caloriesMatch) metrics.calories = parseInt(caloriesMatch[1]);
    }

    return metrics;
  };

  const getActivityIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      Run: "bi-person-running",
      Ride: "bi-bicycle",
      Walk: "bi-person-walking",
      Swim: "bi-water",
      Hike: "bi-snow",
      Rowing: "bi-water",
      Ski: "bi-snow",
    };
    return icons[type] || "bi-activity";
  };

  const getActivityBadgeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      Run: "bg-danger",
      Ride: "bg-primary",
      Walk: "bg-success",
      Swim: "bg-info",
      Hike: "bg-warning text-dark",
      Rowing: "bg-info",
      Ski: "bg-primary",
    };
    return colors[type] || "bg-secondary";
  };

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
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

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
          {/* Summary Statistics */}
          {stats && stats.totalActivities > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Summary</h5>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={useMetric ? "metric" : "imperial"}
                    onChange={(e) => setUseMetric(e.target.value === "metric")}
                  >
                    <option value="imperial">Imperial (mi, ft)</option>
                    <option value="metric">Metric (km, m)</option>
                  </select>
                </div>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i
                        className="bi bi-list-ol text-primary"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      <div className="h4 mb-0">{stats.totalActivities}</div>
                      <small className="text-muted">Activities</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i
                        className="bi bi-signpost-2 text-primary"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      <div className="h4 mb-0">
                        {formatDistance(stats.totalDistance, useMetric)}
                      </div>
                      <small className="text-muted">Total Distance</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i
                        className="bi bi-clock text-primary"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      <div className="h4 mb-0">
                        {formatDuration(stats.totalDuration)}
                      </div>
                      <small className="text-muted">Total Time</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i
                        className="bi bi-fire text-warning"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      <div className="h4 mb-0">
                        {Math.round(stats.totalCalories)}
                      </div>
                      <small className="text-muted">Total Calories</small>
                    </div>
                  </div>
                </div>

                {/* Activity Type Breakdown */}
                {Object.keys(stats.activityTypes).length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="mb-2">Activity Types</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(stats.activityTypes).map(
                        ([type, count]) => (
                          <span key={type} className="badge bg-secondary">
                            {type}: {count}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activities List */}
          <p role="status" className="mb-4">
            {articles.length} published Strava{" "}
            {articles.length === 1 ? "activity" : "activities"} found.
          </p>

          {articles.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i
                  className="bi bi-inbox text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h4 className="mt-3">No Activities Found</h4>
                <p className="text-muted">
                  No Strava activities have been imported yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => {
                const metrics = extractMetrics(article);
                const isExpanded = expandedId === article.id;

                return (
                  <div key={article.id} className="card">
                    <div className="card-body">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1">
                            <i
                              className={`bi ${getActivityIcon(metrics.type)} me-2`}
                            ></i>
                            {article.title}
                          </h5>
                          <p className="text-muted small mb-0">
                            {article.published_date}
                          </p>
                        </div>
                        <span
                          className={`badge ${getActivityBadgeColor(metrics.type)}`}
                        >
                          <i
                            className={`bi ${getActivityIcon(metrics.type)} me-1`}
                          ></i>
                          {metrics.type}
                        </span>
                      </div>

                      {/* MVP Stats - Always Visible */}
                      <div className="row g-2 mb-3">
                        <div className="col-6 col-md-3">
                          <div className="text-center p-2 bg-light rounded">
                            <i className="bi bi-signpost-2 text-primary"></i>
                            <div className="fw-bold">
                              {formatDistance(metrics.distance, useMetric)}
                            </div>
                            <small className="text-muted">Distance</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-2 bg-light rounded">
                            <i className="bi bi-clock text-primary"></i>
                            <div className="fw-bold">
                              {formatDuration(metrics.duration)}
                            </div>
                            <small className="text-muted">Duration</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-2 bg-light rounded">
                            <i className="bi bi-heart-pulse text-danger"></i>
                            <div className="fw-bold">
                              {metrics.avgHR
                                ? `${metrics.avgHR} bpm`
                                : "N/A"}
                            </div>
                            <small className="text-muted">Avg Heart Rate</small>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-center p-2 bg-light rounded">
                            <i className="bi bi-fire text-warning"></i>
                            <div className="fw-bold">
                              {metrics.calories
                                ? Math.round(metrics.calories)
                                : "N/A"}
                            </div>
                            <small className="text-muted">Calories</small>
                          </div>
                        </div>
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : article.id)
                        }
                      >
                        <i
                          className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"} me-1`}
                        ></i>
                        {isExpanded ? "Hide Details" : "Show Details"}
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-top pt-3 mt-3">
                          <div className="row g-3">
                            {/* Speed Card */}
                            <div className="col-md-6">
                              <div className="card border-primary">
                                <div className="card-body pb-2">
                                  <h6 className="card-subtitle mb-3 text-primary">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Speed
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-arrow-right text-info me-2"></i>
                                    <div>
                                      <small className="text-muted d-block">
                                        Average
                                      </small>
                                      <strong className="text-info">
                                        {formatSpeed(metrics.avgSpeed, useMetric)}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Elevation Card */}
                            {metrics.elevation && (
                              <div className="col-md-6">
                                <div className="card border-success">
                                  <div className="card-body pb-2">
                                    <h6 className="card-subtitle mb-3 text-success">
                                      <i className="bi bi-graph-up-arrow me-2"></i>
                                      Elevation
                                    </h6>
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-triangle text-success me-2 fs-4"></i>
                                      <div>
                                        <small className="text-muted d-block">
                                          Total Gain
                                        </small>
                                        <strong className="fs-5 text-success">
                                          {useMetric
                                            ? `${Math.round(metrics.elevation / 3.28084)}m`
                                            : `${metrics.elevation}ft`}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Heart Rate Section */}
                          {(metrics.avgHR || metrics.maxHR) && (
                            <div className="card border-danger mt-3">
                              <div className="card-body">
                                <h6 className="card-subtitle mb-3 text-danger">
                                  <i className="bi bi-heart-pulse-fill me-2"></i>
                                  Heart Rate Analysis
                                </h6>
                                <div className="row g-3">
                                  {metrics.avgHR && (
                                    <div className="col-md-6">
                                      <div>
                                        <small className="text-muted">
                                          Average
                                        </small>
                                        <div className="d-flex align-items-center">
                                          <strong className="text-danger me-2">
                                            {metrics.avgHR} bpm
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {metrics.maxHR && (
                                    <div className="col-md-6">
                                      <div>
                                        <small className="text-muted">Max</small>
                                        <div className="d-flex align-items-center">
                                          <strong className="text-danger">
                                            {metrics.maxHR} bpm
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Full Content */}
                          <div className="mt-3">
                            <h6>Full Details</h6>
                            <div
                              className="small"
                              dangerouslySetInnerHTML={{
                                __html: article.content || "",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <BackToTop />
    </>
  );
};

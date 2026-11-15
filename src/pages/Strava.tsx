import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ArticleCard } from "../components/articles/ArticleCard";
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

export const StravaPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [useMetric, setUseMetric] = useState(false);

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
      // Extract metrics from excerpt: "X.Xmi in YYmin" or "X.Xmi in YYmin +Zm"
      const excerptMatch = article.excerpt?.match(
        /(\d+\.?\d*)mi in (\d+)min/,
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

  const formatDistance = (miles: number, metric: boolean): string => {
    if (metric) {
      const km = miles * 1.60934;
      return `${km.toFixed(1)} km`;
    }
    return `${miles.toFixed(1)} mi`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <PageTitleH1
        title="Strava"
        description="Articles and updates about Strava, activity tracking, and training."
        keywords="Strava, activity tracking, training"
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
                    <option value="imperial">Imperial (mi)</option>
                    <option value="metric">Metric (km)</option>
                  </select>
                </div>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i className="bi bi-list-ol text-primary" style={{fontSize: '1.5rem'}}></i>
                      <div className="h4 mb-0">{stats.totalActivities}</div>
                      <small className="text-muted">Activities</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i className="bi bi-signpost-2 text-primary" style={{fontSize: '1.5rem'}}></i>
                      <div className="h4 mb-0">
                        {formatDistance(stats.totalDistance, useMetric)}
                      </div>
                      <small className="text-muted">Total Distance</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i className="bi bi-clock text-primary" style={{fontSize: '1.5rem'}}></i>
                      <div className="h4 mb-0">
                        {formatDuration(stats.totalDuration)}
                      </div>
                      <small className="text-muted">Total Time</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <i className="bi bi-fire text-warning" style={{fontSize: '1.5rem'}}></i>
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
                          <span
                            key={type}
                            className="badge bg-secondary"
                          >
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

          {/* Articles Grid */}
          <p role="status" className="mb-4">
            {articles.length} published Strava{" "}
            {articles.length === 1 ? "article" : "articles"} found.
          </p>
          <div className="row">
            {articles.map((article) => (
              <div
                key={article.id}
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </>
      )}

      <BackToTop />
    </>
  );
};

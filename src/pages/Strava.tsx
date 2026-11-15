import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ArticleCard } from "../components/articles/ArticleCard";
import { getSupabaseClient } from "../../backend/index.js";
import type { Article } from "../interfaces/Article";

const { createDatabaseService } = await import("../../backend/index.js");

export const StravaPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const client = getSupabaseClient();
        const db = createDatabaseService(client);
        const data = await db.getArticles({ category: "Strava" });
        setArticles(data || []);
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
          <p role="status">
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

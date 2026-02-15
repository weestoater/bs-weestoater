import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ArticleCard } from "../components/articles/ArticleCard";
import { getSupabaseClient } from "../../backend/index.js";
import type { Article } from "../interfaces/Article";

const { createDatabaseService } = await import("../../backend/index.js");

export const AgilePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const client = getSupabaseClient();
        const db = createDatabaseService(client);
        const data = await db.getArticles({ category: "Agile" });
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
        title="Agile"
        description="Insights and lessons learned from agile software development practices, including mob programming, sprint planning, and team collaboration."
        keywords="agile, scrum, mob programming, software development, team practices, agile methodology"
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
        <div className="row">
          {articles.map((article) => (
            <div
              key={article.id}
              className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      <BackToTop />
    </>
  );
};

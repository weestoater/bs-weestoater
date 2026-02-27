import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ArticleCard } from "../components/articles/ArticleCard";
import { getSupabaseClient } from "../../backend/index.js";
import type { Article } from "../interfaces/Article";

const { createDatabaseService } = await import("../../backend/index.js");

export const A11yPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const client = getSupabaseClient();
        const db = createDatabaseService(client);
        const data = await db.getArticles({ category: "Accessibility" });
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
        title="Accessibility (a11y)"
        description="Web accessibility resources, tools, and best practices. Learn about WCAG compliance, screen readers, and creating inclusive web experiences."
        keywords="accessibility, a11y, WCAG, screen readers, inclusive design, web accessibility, axe DevTools"
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
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
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

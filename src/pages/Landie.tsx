import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ArticleCard } from "../components/articles/ArticleCard";
import { getSupabaseClient } from "../../backend/index.js";
import { useDataFetch } from "../hooks/useDataFetch";
import type { Article } from "../interfaces/Article";

const { createDatabaseService } = await import("../../backend/index.js");

export const LandiePage = () => {
  const {
    data: articles,
    loading,
    error,
  } = useDataFetch<Article[]>(
    async () => {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      return await db.getArticles({ category: "Landie" });
    },
    { initialData: [] },
  );

  return (
    <>
      <PageTitleH1
        title="Land Rovers"
        description="Personal collection and experiences with Land Rover vehicles and off-road adventures."
        keywords="Land Rover, off-road, vehicles, automotive"
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
          {articles?.map((article) => (
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

import type { Article } from "../../interfaces/Article";
import { ArticleMeta } from "../global/ArticleMeta";

interface ArticleCardProps {
  article: Article;
  showExcerpt?: boolean;
}

export const ArticleCard = ({
  article,
  showExcerpt = false,
}: ArticleCardProps) => {
  return (
    <div className="card h-100">
      <div className="card-header">
        <h2>
          {article.icon && <i className={`${article.icon} me-2`}></i>}
          {article.title}
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: article.title,
            publishedDate: article.published_date,
            updatedDate: article.updated_date,
            readingTime: article.reading_time,
            tags: article.tags,
            category: article.category,
            author: article.author,
          }}
        />
        {article.image_url && (
          <div className="article-card-image mb-3">
            <img
              src={article.image_url}
              alt={article.image_alt || article.title}
              className="img-fluid rounded"
              loading="lazy"
            />
          </div>
        )}
        {showExcerpt && article.excerpt && (
          <div
            className="article-excerpt mb-3"
            dangerouslySetInnerHTML={{ __html: article.excerpt }}
          />
        )}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

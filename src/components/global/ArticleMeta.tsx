import { Badge } from "reactstrap";
import { formatDateMedium } from "../../utils/dateUtils";

export interface ArticleMetadata {
  title?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
  readingTime?: number;
  tags?: string[];
  category?: string;
}

interface ArticleMetaProps {
  metadata: ArticleMetadata;
}

export const ArticleMeta = ({ metadata }: ArticleMetaProps) => {
  const {
    author = "Ian Burrett",
    publishedDate,
    updatedDate,
    readingTime,
    tags = [],
    category,
  } = metadata;

  return (
    <div className="article-meta">
      <div className="article-meta-primary">
        {author && (
          <span className="article-author">
            <i className="bi bi-person-fill me-1" aria-hidden="true"></i>
            {author}
          </span>
        )}
        {/* publishedDate intentionally not rendered (per project preference) */}
        {readingTime !== undefined && readingTime !== null && (
          <span className="article-reading-time">
            <i className="bi bi-clock me-1" aria-hidden="true"></i>
            {readingTime} min read
          </span>
        )}
      </div>

      {(category || tags.length > 0) && (
        <div className="article-meta-secondary">
          {category && (
            <Badge color="primary" className="article-category">
              {category}
            </Badge>
          )}
          {tags.map((tag, index) => (
            <Badge key={index} color="secondary" className="article-tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {updatedDate && updatedDate !== publishedDate && (
        <div className="article-updated">
          <small className="text-muted">
            <i className="bi bi-pencil me-1" aria-hidden="true"></i>
            Updated:{" "}
            <time dateTime={updatedDate}>
              {updatedDate ? formatDateMedium(updatedDate) : null}
            </time>
          </small>
        </div>
      )}
    </div>
  );
};

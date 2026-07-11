/**
 * ContentBlock Component
 * Renders a dynamic content block from the database
 * Replaces hard-coded card components (DynamicCard, EthosCard, etc.)
 */

import { ArticleMeta } from "../global/ArticleMeta";
import type { ContentBlock as ContentBlockType } from "../../types/weecms";

interface ContentBlockProps {
  block: ContentBlockType;
}

export const ContentBlock = ({ block }: ContentBlockProps) => {
  const { title, content, excerpt, icon, metadata } = block;

  // Parse metadata for ArticleMeta if present
  const articleMeta = metadata?.articleMeta as
    | {
        title?: string;
        category?: string;
        author?: string;
        tags?: string[];
        publishedDate?: string;
        readingTime?: number;
      }
    | undefined;

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          {icon && <i className={`${icon} me-4`}></i>}
          {title}
        </h2>
      </div>
      <div className="card-body">
        {articleMeta && (
          <ArticleMeta
            metadata={{
              title: articleMeta.title || title,
              category: articleMeta.category || "content",
              author: articleMeta.author || "Ian Burrett",
              tags: articleMeta.tags || [],
              publishedDate:
                articleMeta.publishedDate ||
                new Date().toISOString().split("T")[0],
              readingTime: articleMeta.readingTime || 3,
            }}
          />
        )}
        {excerpt && <p className="lead">{excerpt}</p>}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

/**
 * ContentBlockGrid Component
 * Fetches and renders content blocks for a specific page
 */

import { useEffect, useState } from "react";
import { ContentBlock } from "./ContentBlock";
import { createContentServiceFromEnv } from "../../../backend";
import type { ContentBlock as ContentBlockType } from "../../types/weecms";

interface ContentBlockGridProps {
  page: string;
  includeUnpublished?: boolean;
}

export const ContentBlockGrid = ({
  page,
  includeUnpublished = false,
}: ContentBlockGridProps) => {
  const [blocks, setBlocks] = useState<ContentBlockType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const contentService = await createContentServiceFromEnv();
        const data = await contentService.getContentBlocksForPage(page, {
          includeUnpublished,
        });

        setBlocks(data);
      } catch (err) {
        console.error("Error fetching content blocks:", err);
        setError("Failed to load content blocks");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [page, includeUnpublished]);

  if (loading) {
    return (
      <div className="row">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
          >
            <div className="card">
              <div className="card-header placeholder-glow">
                <span className="placeholder col-6"></span>
              </div>
              <div className="card-body placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-8"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle-fill me-2"></i>
        No content blocks found for this page.
      </div>
    );
  }

  return (
    <div className="row">
      {blocks.map((block) => (
        <div key={block.id} className={`${block.grid_size} mb-4`}>
          <ContentBlock block={block} />
        </div>
      ))}
    </div>
  );
};

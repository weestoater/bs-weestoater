import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../../backend/index.js";
import type { ContentBlock } from "../../types/weecms";
import { useSEO } from "../../utils/useSEO";

const { createContentService } = await import("../../../backend/index.js");

export const ContentBlocksManager = () => {
  useSEO({
    title: "Manage Content Blocks",
    description: "Edit and manage content blocks for pages",
  });

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPage, setFilterPage] = useState<string>("all");

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const contentService = createContentService(client);
      const data = await contentService.getContentBlocks({
        includeUnpublished: true,
        page: filterPage === "all" ? undefined : filterPage,
      });
      setBlocks(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load content blocks",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, [filterPage]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const client = getSupabaseClient();
      const contentService = createContentService(client);
      await contentService.deleteContentBlock(id);
      await loadBlocks();
    } catch (err) {
      alert(
        `Failed to delete content block: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const togglePublished = async (block: ContentBlock) => {
    try {
      const client = getSupabaseClient();
      const contentService = createContentService(client);

      if (block.published) {
        await contentService.unpublishContentBlock(block.id);
      } else {
        await contentService.publishContentBlock(block.id);
      }

      await loadBlocks();
    } catch (err) {
      alert(
        `Failed to update content block: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  // Get unique pages for filter
  const pages = ["all", ...new Set(blocks.map((b) => b.page))];

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-grid-3x3-gap-fill me-3"></i>
              Content Blocks Manager
            </h1>
            <Link
              to="/admin/content-blocks/new"
              className="btn btn-primary btn-lg"
            >
              <i className="bi bi-plus-lg me-2"></i>
              New Content Block
            </Link>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="pageFilter" className="form-label">
            Filter by Page
          </label>
          <select
            id="pageFilter"
            className="form-select"
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
          >
            {pages.map((page) => (
              <option key={page} value={page}>
                {page === "all" ? "All Pages" : page}
              </option>
            ))}
          </select>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle-fill me-2"></i>
          No content blocks found. Create your first one!
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Page</th>
                    <th>Type</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block) => (
                    <tr key={block.id}>
                      <td>
                        {block.icon && <i className={`${block.icon} me-2`}></i>}
                        <strong>{block.title}</strong>
                        {block.excerpt && (
                          <div className="text-muted small">
                            {block.excerpt.substring(0, 60)}...
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{block.page}</span>
                      </td>
                      <td>{block.content_type}</td>
                      <td>{block.order_index}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            block.published ? "btn-success" : "btn-warning"
                          }`}
                          onClick={() => togglePublished(block)}
                        >
                          {block.published ? (
                            <>
                              <i className="bi bi-eye-fill me-1"></i>
                              Published
                            </>
                          ) : (
                            <>
                              <i className="bi bi-eye-slash-fill me-1"></i>
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(block.updated_at).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/content-blocks/edit/${block.id}`}
                            className="btn btn-outline-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(block.id, block.title)}
                            title="Delete"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

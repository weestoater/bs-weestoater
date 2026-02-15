import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../../backend/index.js";
import type { Article } from "../../interfaces/Article";
import { useSEO } from "../../utils/useSEO";

const { createDatabaseService } = await import("../../../backend/index.js");

export const ArticlesManager = () => {
  useSEO({
    title: "Manage Articles",
    description: "Edit and manage article content",
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const loadArticles = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const options =
        filterCategory === "all"
          ? { includeUnpublished: true }
          : { includeUnpublished: true, category: filterCategory };
      const data = await db.getArticles(options);
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [filterCategory]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteArticle(id);

      // Reload articles after deletion
      await loadArticles();
    } catch (err) {
      alert(
        `Failed to delete article: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const togglePublished = async (article: Article) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.updateArticle(article.id, {
        published: !article.published,
      });

      // Reload articles after update
      await loadArticles();
    } catch (err) {
      alert(
        `Failed to update article: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const toggleFeatured = async (article: Article) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.updateArticle(article.id, {
        featured: !article.featured,
      });

      // Reload articles after update
      await loadArticles();
    } catch (err) {
      alert(
        `Failed to update article: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

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

  const categories = ["all", "React", "Agile", "Accessibility", "Landie"];

  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-newspaper me-2"></i>
              Manage Articles
            </h1>
            <div>
              <Link to="/admin" className="btn btn-outline-secondary me-2">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
              <Link to="/admin/articles/new" className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>
                Add New Article
              </Link>
            </div>
          </div>
          <hr />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <div
            className="btn-group"
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-outline-primary ${
                  filterCategory === cat ? "active" : ""
                }`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-6 text-end">
          <span className="text-muted">
            Showing {articles.length} article{articles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No articles found. Click "Add New Article" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Reading Time</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                    <br />
                    <small className="text-muted">{article.slug}</small>
                  </td>
                  <td>
                    <span className="badge bg-info">{article.category}</span>
                  </td>
                  <td>
                    {new Date(article.published_date).toLocaleDateString()}
                  </td>
                  <td>{article.reading_time} min</td>
                  <td>
                    <span
                      className={`badge ${
                        article.published ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    {article.featured && (
                      <i className="bi bi-star-fill text-warning"></i>
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/articles/edit/${article.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => toggleFeatured(article)}
                        title={article.featured ? "Unfeature" : "Feature"}
                      >
                        <i
                          className={`bi bi-star${
                            article.featured ? "-fill" : ""
                          }`}
                        ></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => togglePublished(article)}
                        title={article.published ? "Unpublish" : "Publish"}
                      >
                        <i
                          className={`bi bi-${
                            article.published ? "eye-slash" : "eye"
                          }`}
                        ></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(article.id, article.title)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { getSupabaseClient } from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";
import { createTinyMCEConfig } from "../../utils/tinymceHelpers";
import type { ContentBlock } from "../../types/weecms";

const { createContentService } = await import("../../../backend/index.js");

export const ContentBlockEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== "new";

  useSEO({
    title: isEdit ? "Edit Content Block" : "Add New Content Block",
    description: isEdit
      ? "Edit content block details"
      : "Create a new content block",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    icon: "",
    page: "home",
    section: "",
    content_type: "card" as "card" | "hero" | "text" | "embed" | "custom",
    order_index: 0,
    grid_size: "col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12",
    published: true,
    publish_at: "",
    unpublish_at: "",
    metadata: {} as Record<string, unknown>,
  });

  useEffect(() => {
    if (isEdit) {
      loadBlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBlock = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const client = getSupabaseClient();
      const contentService = createContentService(client);
      const data = await contentService.getContentBlockById(id);

      if (!data) throw new Error("Content block not found");

      setFormData({
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || "",
        icon: data.icon || "",
        page: data.page,
        section: data.section || "",
        content_type: data.content_type,
        order_index: data.order_index,
        grid_size: data.grid_size,
        published: data.published,
        publish_at: data.publish_at || "",
        unpublish_at: data.unpublish_at || "",
        metadata: data.metadata || {},
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load content block",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const client = getSupabaseClient();
      const contentService = createContentService(client);

      // Prepare data (convert empty strings to null for optional fields)
      const dataToSave = {
        ...formData,
        excerpt: formData.excerpt || undefined,
        icon: formData.icon || undefined,
        section: formData.section || undefined,
        publish_at: formData.publish_at || undefined,
        unpublish_at: formData.unpublish_at || undefined,
      };

      console.log("💾 Saving content block with data:", dataToSave);
      console.log("📄 Content being saved:", dataToSave.content);

      if (isEdit && id) {
        await contentService.updateContentBlock(id, dataToSave);
      } else {
        await contentService.createContentBlock(dataToSave);
      }

      navigate("/admin/content-blocks");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save content block",
      );
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value, 10)
            : value,
    }));
  };

  const handleEditorChange = (content: string) => {
    console.log("📝 Editor content changed:", content);
    setFormData((prev) => ({
      ...prev,
      content,
    }));
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

  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-grid-3x3-gap-fill me-3"></i>
              {isEdit ? "Edit Content Block" : "Add New Content Block"}
            </h1>
            <Link
              to="/admin/content-blocks"
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Content Blocks
            </Link>
          </div>
          <hr />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Content</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="slug" className="form-label">
                    Slug *{" "}
                    <small className="text-muted">(unique identifier)</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    pattern="[a-z0-9-]+"
                    title="Lowercase letters, numbers, and hyphens only"
                    required
                  />
                  <small className="form-text text-muted">
                    e.g., "home-dynamic-card"
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="excerpt" className="form-label">
                    Excerpt
                  </label>
                  <textarea
                    className="form-control"
                    id="excerpt"
                    name="excerpt"
                    rows={2}
                    value={formData.excerpt}
                    onChange={handleChange}
                  />
                  <small className="form-text text-muted">
                    Optional short summary
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content *
                  </label>
                  <Editor
                    apiKey="cart3icxunk0rbc9m0xjrflqcmqghdf73tlipo4uynpwe7fp"
                    init={createTinyMCEConfig()}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="h5 mb-0">Settings</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="page" className="form-label">
                    Page *
                  </label>
                  <select
                    className="form-select"
                    id="page"
                    name="page"
                    value={formData.page}
                    onChange={handleChange}
                    required
                  >
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="content_type" className="form-label">
                    Content Type
                  </label>
                  <select
                    className="form-select"
                    id="content_type"
                    name="content_type"
                    value={formData.content_type}
                    onChange={handleChange}
                  >
                    <option value="card">Card</option>
                    <option value="hero">Hero</option>
                    <option value="text">Text</option>
                    <option value="embed">Embed</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="icon" className="form-label">
                    Icon Class
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="bi bi-database-check"
                  />
                  <small className="form-text text-muted">
                    Bootstrap Icons or custom class
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="order_index" className="form-label">
                    Order Index
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="order_index"
                    name="order_index"
                    value={formData.order_index}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="grid_size" className="form-label">
                    Grid Size
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="grid_size"
                    name="grid_size"
                    value={formData.grid_size}
                    onChange={handleChange}
                  />
                  <small className="form-text text-muted">
                    Bootstrap grid classes
                  </small>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="published">
                    Published
                  </label>
                </div>

                <hr />

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {isEdit ? "Update" : "Create"} Content Block
                      </>
                    )}
                  </button>
                  <Link
                    to="/admin/content-blocks"
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

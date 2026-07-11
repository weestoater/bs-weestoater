import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { getSupabaseClient } from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";
import { calculateReadingTime } from "../../utils/readingTime";
import { createTinyMCEConfig } from "../../utils/tinymceHelpers";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

const { createDatabaseService } = await import("../../../backend/index.js");

export const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== "new";

  useSEO({
    title: isEdit ? "Edit Article" : "Add New Article",
    description: isEdit ? "Edit article details" : "Create a new article entry",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    category: "React",
    content: "",
    excerpt: "",
    icon: "bi-newspaper",
    published_date: new Date().toISOString().split("T")[0],
    updated_date: "",
    reading_time: 0,
    tags: [] as string[],
    published: false,
    featured: false,
    author: "Ian Burrett",
    order_index: 0,
    publish_at: "", // Optional: schedule publishing for future date/time
    image_url: "",
    image_alt: "",
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isEdit) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const data = await db.getArticleById(id);

      if (!data) throw new Error("Article not found");

      setFormData({
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category,
        content: data.content,
        excerpt: data.excerpt || "",
        icon: data.icon || "bi-newspaper",
        published_date: data.published_date,
        updated_date: data.updated_date || "",
        reading_time: data.reading_time || 0,
        tags: data.tags || [],
        published: data.published,
        featured: data.featured || false,
        author: data.author || "Ian Burrett",
        order_index: data.order_index || 0,
        publish_at: data.publish_at
          ? new Date(data.publish_at).toISOString().slice(0, 16)
          : "",
        image_url: data.image_url || "",
        image_alt: data.image_alt || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }

      // Auto-generate slug from title if empty
      let cleanSlug = formData.slug.trim();
      if (!cleanSlug) {
        cleanSlug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      } else {
        // Clean the existing slug
        cleanSlug = cleanSlug.toLowerCase().replace(/\s+/g, "-").trim();
      }

      if (!cleanSlug) {
        throw new Error("Could not generate a valid slug from the title");
      }

      // Auto-calculate reading time from content
      const readingTime = calculateReadingTime(formData.content);

      // Format publish_at: convert to ISO timestamp or undefined if empty
      const publishAt = formData.publish_at
        ? new Date(formData.publish_at).toISOString()
        : undefined;

      const dataToSave = {
        ...formData,
        slug: cleanSlug,
        reading_time: readingTime,
        updated_date: new Date().toISOString().split("T")[0],
        publish_at: publishAt,
      };

      const client = getSupabaseClient();
      const db = createDatabaseService(client);

      if (isEdit && id) {
        await db.updateArticle(id, dataToSave);
      } else {
        // Use the clean slug as the ID for new articles
        await db.createArticle({ ...dataToSave, id: cleanSlug });
      }

      navigate("/admin/articles");
    } catch (err) {
      console.error("Error saving article:", err);
      setError(err instanceof Error ? err.message : "Failed to save article");
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleExcerptChange = (excerpt: string) => {
    setFormData((prev) => ({
      ...prev,
      excerpt: excerpt,
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setFormData((prev) => ({ ...prev, slug }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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
    <div className="container-fluid mt-4 mb-5">
      <AdminPageHeader
        title={isEdit ? "Edit Article" : "Add New Article"}
        icon="bi-newspaper"
        description={isEdit ? "Edit article details" : "Create a new article"}
        backLink="/admin/articles"
        backLabel="Articles Manager"
      />

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
                <h5 className="mb-0">Article Content</h5>
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
                    <small className="text-muted">(URL-friendly ID)</small>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      pattern="[a-z0-9-]+"
                      title="Only lowercase letters, numbers, and hyphens"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={generateSlug}
                    >
                      Generate from Title
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="excerpt" className="form-label">
                    Excerpt
                  </label>
                  <Editor
                    apiKey="cart3icxunk0rbc9m0xjrflqcmqghdf73tlipo4uynpwe7fp"
                    value={formData.excerpt}
                    onEditorChange={handleExcerptChange}
                    init={{
                      height: 150,
                      menubar: false,
                      plugins: ["wordcount"],
                      toolbar: "undo redo | bold italic | removeformat",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                  <small className="form-text text-muted">
                    Brief summary for article cards and previews
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content *
                  </label>
                  <Editor
                    apiKey="cart3icxunk0rbc9m0xjrflqcmqghdf73tlipo4uynpwe7fp"
                    value={formData.content}
                    onEditorChange={handleContentChange}
                    init={createTinyMCEConfig("articles")}
                  />
                  <small className="form-text text-muted">
                    Reading time will be auto-calculated on save. You can paste
                    or upload images directly into the editor.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Metadata</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="React">React</option>
                    <option value="Agile">Agile</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Landie">Landie</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="icon" className="form-label">
                    Icon <small className="text-muted">(Bootstrap Icon)</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="bi-newspaper"
                  />
                  <small className="form-text text-muted">
                    <a
                      href="https://icons.getbootstrap.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Browse Bootstrap Icons
                    </a>
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="author" className="form-label">
                    Author
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="published_date" className="form-label">
                    Published Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="published_date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="order_index" className="form-label">
                    Display Order
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
                  <small className="form-text text-muted">
                    Lower numbers appear first
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={addTag}
                    >
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="badge bg-secondary">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          style={{ fontSize: "0.6rem" }}
                          onClick={() => removeTag(tag)}
                          aria-label="Remove tag"
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="published">
                      Published
                    </label>
                  </div>
                </div>

                {formData.published && (
                  <div className="mb-3">
                    <label htmlFor="publish_at" className="form-label">
                      Schedule Publishing (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="publish_at"
                      name="publish_at"
                      value={formData.publish_at}
                      onChange={handleChange}
                    />
                    <small className="form-text text-muted">
                      Leave empty to publish immediately. Set a future date/time
                      to schedule publishing.
                    </small>
                  </div>
                )}

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Featured Article
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Feature Image</h5>
              </div>
              <div className="card-body">
                <ImageUpload
                  onUploadComplete={(url) =>
                    setFormData((prev) => ({ ...prev, image_url: url }))
                  }
                  currentImage={formData.image_url || undefined}
                  bucket="images"
                  folder="articles"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <label htmlFor="image_alt" className="form-label">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="image_alt"
                      name="image_alt"
                      value={formData.image_alt}
                      onChange={handleChange}
                      placeholder="Describe the image for screen readers"
                    />
                    <small className="form-text text-muted">
                      Shown when image cannot be displayed. Important for
                      accessibility.
                    </small>
                  </div>
                )}
                {formData.image_url && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-3"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image_url: "",
                        image_alt: "",
                      }))
                    }
                  >
                    <i className="bi bi-trash me-1"></i>Remove Image
                  </button>
                )}
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i>
                    {isEdit ? "Update Article" : "Create Article"}
                  </>
                )}
              </button>
              <Link to="/admin/articles" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

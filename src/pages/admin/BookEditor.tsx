import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { getSupabaseClient } from "../../../backend/index.js";
import { useSEO } from "../../utils/useSEO";

const { createDatabaseService } = await import("../../../backend/index.js");

export const BookEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== "new";

  useSEO({
    title: isEdit ? "Edit Book" : "Add New Book",
    description: isEdit ? "Edit book details" : "Create a new book entry",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cover_image: "",
    description: "",
    order_index: 0,
    published: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const data = await db.getBookById(id);

      if (!data) throw new Error("Book not found");

      setFormData({
        title: data.title,
        author: data.author,
        cover_image: data.cover_image,
        description: data.description,
        order_index: data.order_index,
        published: data.published,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load book");
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
      const db = createDatabaseService(client);

      if (isEdit && id) {
        await db.updateBook(id, formData);
      } else {
        await db.createBook(formData);
      }

      navigate("/admin/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    setFormData((prev) => ({
      ...prev,
      description: content,
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
              <i className="bi bi-book me-2"></i>
              {isEdit ? "Edit Book" : "Add New Book"}
            </h1>
            <Link to="/admin/books" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Books
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

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
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
                  <label htmlFor="author" className="form-label">
                    Author *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cover_image" className="form-label">
                    Cover Image URL *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cover_image"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleChange}
                    placeholder="/assets/img/book-cover.jpg"
                    required
                  />
                  <small className="form-text text-muted">
                    Use relative path like /assets/img/filename.jpg or full URL
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <Editor
                    apiKey="cart3icxunk0rbc9m0xjrflqcmqghdf73tlipo4uynpwe7fp"
                    value={formData.description}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | link | code | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
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

                  <div className="col-md-6 mb-3">
                    <label className="form-label d-block">Status</label>
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
                </div>

                <div className="d-flex gap-2">
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
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i>
                        {isEdit ? "Update Book" : "Create Book"}
                      </>
                    )}
                  </button>
                  <Link to="/admin/books" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: "20px" }}>
            <div className="card-header">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body">
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt={formData.title || "Book cover"}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect fill='%23ddd' width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              )}
              <h5>{formData.title || "Book Title"}</h5>
              <p className="text-muted">{formData.author || "Author Name"}</p>
              {formData.description ? (
                <div
                  className="small"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              ) : (
                <p className="small text-muted">
                  Book description will appear here...
                </p>
              )}
              <div className="mt-2">
                <span
                  className={`badge ${
                    formData.published ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {formData.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

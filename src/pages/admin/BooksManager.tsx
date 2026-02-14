import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../../backend/index.js";
import type { Book } from "../../interfaces/Book";
import { useSEO } from "../../utils/useSEO";

const { createDatabaseService } = await import("../../../backend/index.js");

export const BooksManager = () => {
  useSEO({
    title: "Manage Books",
    description: "Edit and manage book content",
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      const data = await db.getBooks({ includeUnpublished: true });
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.deleteBook(id);

      // Reload books after deletion
      await loadBooks();
    } catch (err) {
      alert(
        `Failed to delete book: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  const togglePublished = async (book: Book) => {
    try {
      const client = getSupabaseClient();
      const db = createDatabaseService(client);
      await db.updateBook(book.id, {
        published: !book.published,
      });

      // Reload books after update
      await loadBooks();
    } catch (err) {
      alert(
        `Failed to update book: ${
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

  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              <i className="bi bi-book me-2"></i>
              Manage Books
            </h1>
            <div>
              <Link to="/admin" className="btn btn-outline-secondary me-2">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
              <Link to="/admin/books/new" className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>
                Add New Book
              </Link>
            </div>
          </div>
          <hr />
        </div>
      </div>

      {books.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No books found. Click "Add New Book" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      style={{
                        width: "60px",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <strong>{book.title}</strong>
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <span
                      className={`badge ${
                        book.published ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {book.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{book.order_index}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/admin/books/edit/${book.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => togglePublished(book)}
                        title={book.published ? "Unpublish" : "Publish"}
                      >
                        <i
                          className={`bi bi-${
                            book.published ? "eye-slash" : "eye"
                          }`}
                        ></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book.id, book.title)}
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

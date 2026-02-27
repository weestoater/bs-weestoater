import { useEffect, useState } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { getSupabaseClient } from "../../backend/index.js";
import { createDatabaseService } from "../../backend/index.js";
import type { Book } from "../interfaces/Book";

export const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const supabase = getSupabaseClient();
        const db = createDatabaseService(supabase);
        const data = await db.getBooks();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <>
      <PageTitleH1
        title="Books"
        description="Some of the books I've read, recommend and found valuable."
        keywords="books, reading, recommendations, literature, valuable reads"
      />

      {loading && (
        <div className="row">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading books...</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="row">
          {books.map((book) => (
            <div
              key={book.id}
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
            >
              <div className="card">
                <div className="card-header">
                  <i className="bi bi-book"></i> {book.title}
                </div>
                <div className="card-body">
                  <img
                    src={book.cover_image}
                    alt={`${book.title} book cover`}
                    className="img-fluid mb-3"
                  />
                  <p>
                    <small>by {book.author}</small>
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: book.description }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BackToTop />
    </>
  );
};

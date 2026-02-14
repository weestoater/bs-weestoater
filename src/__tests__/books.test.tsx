import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { BooksPage } from "../pages/Books";

// Mock the backend module
vi.mock("../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getBooks: vi.fn(() =>
      Promise.resolve([
        {
          id: "dwws",
          title: "Designing with Web Standards",
          author: "Jeffrey Zeldman",
          cover_image: "/assets/img/zeldman-dwws-cover.jpg",
          description: "<p>Test description</p>",
          order_index: 1,
          published: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "czg",
          title: "The Zen of CSS Design",
          author: "Dave Shea & Molly E. Holzschlag",
          cover_image: "/assets/img/shea-tzocd-cover.jpg",
          description: "<p>Test description</p>",
          order_index: 2,
          published: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "afe",
          title: "Accessibility for Everyone",
          author: "Laura Kalbag",
          cover_image: "/assets/img/kalbag-AFE-cover.jpg",
          description: "<p>Test description</p>",
          order_index: 3,
          published: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ]),
    ),
  })),
}));

describe("Books page", () => {
  test("renders page title correctly", async () => {
    render(<BooksPage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Books");
  });

  test("renders book: Designing with Web Standards", async () => {
    render(<BooksPage />);
    const bookTitle = await screen.findByText(/Designing with Web Standards/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders book: The Zen of CSS Design", async () => {
    render(<BooksPage />);
    const bookTitle = await screen.findByText(/The Zen of CSS Design/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders book: Accessibility for Everyone", async () => {
    render(<BooksPage />);
    const bookTitle = await screen.findByText(/Accessibility for Everyone/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders author Jeffrey Zeldman", async () => {
    render(<BooksPage />);
    const author = await screen.findByText(/Jeffrey Zeldman/i);
    expect(author).toBeInTheDocument();
  });

  test("renders author Laura Kalbag", async () => {
    render(<BooksPage />);
    const author = await screen.findByText(/by Laura Kalbag/i);
    expect(author).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    render(<BooksPage />);
    const loadingSpinner = screen.getByRole("status");
    expect(loadingSpinner).toBeInTheDocument();
  });

  test("has BackToTop component", async () => {
    render(<BooksPage />);
    await waitFor(() => {
      const backToTop = screen.getByRole("button", {
        name: /scroll back to top/i,
      });
      expect(backToTop).toBeInTheDocument();
    });
  });
});

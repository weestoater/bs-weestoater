import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "../../../components/articles/ArticleCard";
import type { Article } from "../../../interfaces/Article";

const mockArticle: Article = {
  id: "test-1",
  title: "Test Article Title",
  slug: "test-article-title",
  category: "React",
  content: "<p>This is test content with <strong>HTML</strong></p>",
  excerpt: "<p>This is an excerpt</p>",
  published: true,
  featured: false,
  published_date: "2024-01-01T00:00:00Z",
  updated_date: "2024-01-02T00:00:00Z",
  created_at: "2024-01-01T00:00:00Z",
  author: "Test Author",
  reading_time: 5,
  tags: ["testing", "react"],
  icon: "bi bi-code-slash",
  order_index: 1,
};

describe("ArticleCard", () => {
  test("renders article title correctly", () => {
    render(<ArticleCard article={mockArticle} />);
    const title = screen.getByText("Test Article Title");
    expect(title).toBeInTheDocument();
  });

  test("renders article icon when provided", () => {
    render(<ArticleCard article={mockArticle} />);
    const icon = document.querySelector(".bi-code-slash");
    expect(icon).toBeInTheDocument();
  });

  test("renders article content", () => {
    render(<ArticleCard article={mockArticle} />);
    const content = screen.getByText(/This is test content with/i);
    expect(content).toBeInTheDocument();
  });

  test("renders article metadata", () => {
    render(<ArticleCard article={mockArticle} />);
    const readingTime = screen.getByText(/5 min read/i);
    expect(readingTime).toBeInTheDocument();
  });

  test("does not render excerpt by default", () => {
    render(<ArticleCard article={mockArticle} />);
    const excerpt = screen.queryByText(/This is an excerpt/i);
    expect(excerpt).not.toBeInTheDocument();
  });

  test("renders excerpt when showExcerpt is true", () => {
    render(<ArticleCard article={mockArticle} showExcerpt={true} />);
    const excerpt = screen.getByText(/This is an excerpt/i);
    expect(excerpt).toBeInTheDocument();
  });

  test("handles article without icon", () => {
    const articleWithoutIcon = { ...mockArticle, icon: undefined };
    render(<ArticleCard article={articleWithoutIcon} />);
    const title = screen.getByText("Test Article Title");
    expect(title).toBeInTheDocument();
  });

  test("handles article without excerpt", () => {
    const articleWithoutExcerpt = { ...mockArticle, excerpt: undefined };
    render(<ArticleCard article={articleWithoutExcerpt} showExcerpt={true} />);
    const title = screen.getByText("Test Article Title");
    expect(title).toBeInTheDocument();
  });

  test("renders with correct card structure", () => {
    const { container } = render(<ArticleCard article={mockArticle} />);
    const card = container.querySelector(".card");
    const cardHeader = container.querySelector(".card-header");
    const cardBody = container.querySelector(".card-body");
    expect(card).toBeInTheDocument();
    expect(cardHeader).toBeInTheDocument();
    expect(cardBody).toBeInTheDocument();
  });

  test("renders HTML content correctly", () => {
    render(<ArticleCard article={mockArticle} />);
    const strongElement = screen.getByText("HTML");
    expect(strongElement.tagName).toBe("STRONG");
  });
});

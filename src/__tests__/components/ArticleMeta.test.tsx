import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";
import type { ArticleMetadata } from "../../components/global/ArticleMeta";

describe("ArticleMeta", () => {
  const mockMetadata: ArticleMetadata = {
    author: "Test Author",
    publishedDate: "2024-03-15",
    readingTime: 5,
    tags: ["React", "TypeScript", "Testing"],
    category: "Web Development",
  };

  it("renders article metadata", () => {
    render(<ArticleMeta metadata={mockMetadata} />);

    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
  });

  it("displays all tags as badges", () => {
    render(<ArticleMeta metadata={mockMetadata} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("displays category badge", () => {
    render(<ArticleMeta metadata={mockMetadata} />);

    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("handles single tag", () => {
    const singleTagMetadata: ArticleMetadata = {
      ...mockMetadata,
      tags: ["JavaScript"],
    };

    render(<ArticleMeta metadata={singleTagMetadata} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("handles no tags", () => {
    const noTagsMetadata: ArticleMetadata = {
      ...mockMetadata,
      tags: [],
    };

    render(<ArticleMeta metadata={noTagsMetadata} />);

    // Should still render without errors
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
  });
});

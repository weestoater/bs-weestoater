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

  it("uses semantic time element for published date", () => {
    const { container } = render(<ArticleMeta metadata={mockMetadata} />);

    const timeElement = container.querySelector('time[datetime="2024-03-15"]');
    expect(timeElement).toBeInTheDocument();
  });

  it("shows updated date when provided", () => {
    const metadataWithUpdate: ArticleMetadata = {
      ...mockMetadata,
      updatedDate: "2024-03-20",
    };

    const { container } = render(<ArticleMeta metadata={metadataWithUpdate} />);

    const updatedTimeElement = container.querySelector(
      'time[datetime="2024-03-20"]'
    );
    expect(updatedTimeElement).toBeInTheDocument();
    expect(screen.getByText(/Updated:/i)).toBeInTheDocument();
  });

  it("does not show updated date when same as published", () => {
    const metadataWithSameDate: ArticleMetadata = {
      ...mockMetadata,
      updatedDate: "2024-03-15",
    };

    render(<ArticleMeta metadata={metadataWithSameDate} />);

    expect(screen.queryByText(/Updated:/i)).not.toBeInTheDocument();
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

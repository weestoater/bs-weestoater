import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { A11yPage } from "../pages/A11y";

// Mock the backend module
vi.mock("../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getArticles: vi.fn(() =>
      Promise.resolve([
        {
          id: "a11y-1",
          title: "Web Accessibility Basics",
          category: "Accessibility",
          content: "<p>Test content about accessibility</p>",
          excerpt: "Learn accessibility fundamentals",
          published: true,
          published_date: "2024-01-01T00:00:00Z",
          updated_date: "2024-01-01T00:00:00Z",
          author: "Test Author",
          reading_time: 5,
          tags: ["accessibility", "wcag"],
          icon: "bi bi-universal-access",
        },
      ]),
    ),
  })),
}));

describe("A11y page", () => {
  test("renders h1 correctly", () => {
    render(<A11yPage />);
    const heading: HTMLElement = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Accessibility (a11y)");
  });

  test("renders accessibility article", async () => {
    render(<A11yPage />);
    const articleTitle = await screen.findByText(/Web Accessibility Basics/i);
    expect(articleTitle).toBeInTheDocument();
  });

  test("renders article content", async () => {
    render(<A11yPage />);
    const content = await screen.findByText(
      /Test content about accessibility/i,
    );
    expect(content).toBeInTheDocument();
  });

  test("has BackToTop component", async () => {
    render(<A11yPage />);
    await waitFor(() => {
      const backToTop = screen.getByRole("button", {
        name: /scroll back to top/i,
      });
      expect(backToTop).toBeInTheDocument();
    });
  });
});

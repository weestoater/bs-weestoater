import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LandiePage } from "../../pages/Landie";

// Mock the backend module
vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getArticles: vi.fn(() =>
      Promise.resolve([
        {
          id: "landie-1",
          title: "Landie Design Patterns",
          category: "Landie",
          content: "<p>Test content about Landie patterns</p>",
          excerpt: "Explore effective landing page designs",
          published: true,
          published_date: "2024-01-01T00:00:00Z",
          updated_date: "2024-01-01T00:00:00Z",
          author: "Test Author",
          reading_time: 7,
          tags: ["landie", "design"],
          icon: "bi bi-layout-text-window-reverse",
        },
      ]),
    ),
  })),
}));

describe("Landie page", () => {
  test("renders h1 correctly", async () => {
    render(<LandiePage />);
    const heading = await screen.findByTestId("page-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Land Rovers");
  });

  test("renders landie article", async () => {
    render(<LandiePage />);
    const articleTitle = await screen.findByText(/Landie Design Patterns/i);
    expect(articleTitle).toBeInTheDocument();
  });

  test("renders article content", async () => {
    render(<LandiePage />);
    const content = await screen.findByText(
      /Test content about Landie patterns/i,
    );
    expect(content).toBeInTheDocument();
  });

  test("has BackToTop component", async () => {
    render(<LandiePage />);
    await waitFor(() => {
      const backToTop = screen.getByRole("button", {
        name: /scroll back to top/i,
      });
      expect(backToTop).toBeInTheDocument();
    });
  });
});

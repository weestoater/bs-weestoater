import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AgilePage } from "../../pages/Agile";

// Mock the backend module
vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getArticles: vi.fn(() =>
      Promise.resolve([
        {
          id: "agile-1",
          title: "Mob Programming Essentials",
          category: "Agile",
          content: "<p>Test content about mob programming</p>",
          excerpt: "Learn about collaborative development",
          published: true,
          published_date: "2024-01-01T00:00:00Z",
          updated_date: "2024-01-01T00:00:00Z",
          author: "Test Author",
          reading_time: 8,
          tags: ["agile", "mob programming"],
          icon: "bi bi-people-fill",
        },
        {
          id: "agile-2",
          title: "Agile Best Practices",
          category: "Agile",
          content: "<p>Best practices for agile teams</p>",
          excerpt: "Improve your agile workflow",
          published: true,
          published_date: "2024-01-02T00:00:00Z",
          updated_date: "2024-01-02T00:00:00Z",
          author: "Test Author",
          reading_time: 6,
          tags: ["agile", "scrum"],
          icon: "bi bi-speedometer",
        },
      ]),
    ),
  })),
}));

describe("Agile page", () => {
  test("renders h1 correctly", () => {
    render(<AgilePage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Agile");
  });

  test("renders agile articles", async () => {
    render(<AgilePage />);
    const article1 = await screen.findByText(/Mob Programming Essentials/i);
    const article2 = await screen.findByText(/Agile Best Practices/i);
    expect(article1).toBeInTheDocument();
    expect(article2).toBeInTheDocument();
  });

  test("renders article content", async () => {
    render(<AgilePage />);
    const content = await screen.findByText(
      /Test content about mob programming/i,
    );
    expect(content).toBeInTheDocument();
  });

  test("has BackToTop component", async () => {
    render(<AgilePage />);
    await waitFor(() => {
      const backToTop = screen.getByRole("button", {
        name: /scroll back to top/i,
      });
      expect(backToTop).toBeInTheDocument();
    });
  });
});

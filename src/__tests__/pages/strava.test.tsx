import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StravaPage } from "../../pages/Strava";

const { getArticles } = vi.hoisted(() => ({
  getArticles: vi.fn(() =>
    Promise.resolve([
      {
        id: "strava-article",
        title: "Strava Article",
        slug: "strava-article",
        category: "Strava",
        content: "<p>Strava article content</p>",
        published: true,
        published_date: "2026-01-01",
        tags: [],
        featured: false,
        author: "Test Author",
        order_index: 0,
      },
    ]),
  ),
}));

vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({ getArticles })),
}));

describe("Strava page", () => {
  test("loads and displays Strava articles", async () => {
    render(<StravaPage />);

    expect(await screen.findByText("Strava Article")).toBeInTheDocument();
    expect(
      await screen.findByText("1 published Strava article found."),
    ).toBeInTheDocument();
    expect(getArticles).toHaveBeenCalledWith({ category: "Strava" });
  });
});

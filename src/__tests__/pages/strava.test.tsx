import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StravaPage } from "../../pages/Strava";

const { getArticles } = vi.hoisted(() => ({
  getArticles: vi.fn(() =>
    Promise.resolve([
      {
        id: "strava-2026-01-01-morning-walk",
        title: "Morning Walk",
        slug: "strava-2026-01-01-morning-walk",
        category: "Strava",
        excerpt: "1.5mi (2.4km) in 30min +100ft (30m)",
        content:
          "<h3>Morning Walk</h3><p><strong>Distance:</strong> 1.50 mi (2.41 km)</p><p><strong>Duration:</strong> 30 minutes</p><p><strong>Average Speed:</strong> 3.00 mph (4.82 km/h)</p><p><strong>Average Heart Rate:</strong> 100 bpm</p><p><strong>Calories:</strong> 150</p>",
        published: true,
        published_date: "2026-01-01",
        tags: ["Walk"],
        featured: false,
        author: "Strava Import",
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
  test("loads and displays Strava activities with expandable details", async () => {
    render(<StravaPage />);

    // Check title and article is rendered
    expect(await screen.findByText("Morning Walk")).toBeInTheDocument();

    // Check count message
    expect(
      await screen.findByText("1 published Strava activity found."),
    ).toBeInTheDocument();

    // Check summary stats appear
    expect(await screen.findByText("1")).toBeInTheDocument(); // Activities count
    expect(await screen.findByText("Summary")).toBeInTheDocument();

    // Verify getArticles was called with correct category
    expect(getArticles).toHaveBeenCalledWith({ category: "Strava" });

    // Check MVP stats are visible
    expect(await screen.findByText("Distance")).toBeInTheDocument();
    expect(await screen.findByText("Duration")).toBeInTheDocument();

    // Check show details button exists
    expect(
      await screen.findByText("Show Details"),
    ).toBeInTheDocument();
  });
});


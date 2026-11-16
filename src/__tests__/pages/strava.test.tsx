import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StravaPage } from "../../pages/Strava";

const { fetchStravaActivities, baseActivity } = vi.hoisted(() => {
  const baseActivity = {
    id: 1001,
    name: "Morning Walk",
    sportType: "Walk",
    startDateLocal: "2026-01-01T09:00:00Z",
    distanceM: 2414,
    movingTimeS: 1790,
    elevationGainM: 30,
    averageSpeedMs: 1.34,
    averageHeartrate: 100,
    maxHeartrate: 120,
    polyline: null,
  };
  return {
    baseActivity,
    fetchStravaActivities: vi.fn(() => Promise.resolve([baseActivity])),
  };
});

vi.mock("../../utils/stravaApi", () => ({
  fetchStravaActivities,
  fetchStravaActivityDetail: vi.fn(),
}));

describe("Strava page", () => {
  test("loads and displays Strava activities with expandable details", async () => {
    render(<StravaPage />);

    // Check title and article is rendered
    expect(await screen.findByText("Morning Walk")).toBeInTheDocument();

    // Check count message
    expect(
      await screen.findByText("1 Strava activity found."),
    ).toBeInTheDocument();

    expect(fetchStravaActivities).toHaveBeenCalled();

    // Check MVP stats labels are visible in activity card
    expect(await screen.findByText("Distance")).toBeInTheDocument();
    expect(await screen.findByText("Duration")).toBeInTheDocument();
    expect(await screen.findByText("Avg Speed")).toBeInTheDocument();
    expect(await screen.findByText("Elevation")).toBeInTheDocument();

    // Check that activity card displays formatted values
    const distanceLabels = screen.getAllByText("Distance");
    expect(distanceLabels.length).toBeGreaterThan(0); // At least one card with Distance label

    // Check expand button exists and is initially collapsed
    const expandButton = await screen.findByLabelText("Expand details");
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveAttribute("aria-expanded", "false");

    // Check filter buttons exist
    expect(
      await screen.findByRole("button", { name: /All Types/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Walk/i }),
    ).toBeInTheDocument();
  });

  test("rounds fractional durations to whole minutes", async () => {
    render(<StravaPage />);
    // movingTimeS 1790 is 29.8 minutes, so this must not render a float like 29.83333m
    expect(await screen.findByText("30m")).toBeInTheDocument();
  });

  test("groups all ride variants under a single Bike filter", async () => {
    fetchStravaActivities.mockResolvedValueOnce([
      { ...baseActivity, id: 1, sportType: "MountainBikeRide" },
      { ...baseActivity, id: 2, sportType: "GravelRide" },
    ]);
    render(<StravaPage />);
    expect(
      await screen.findByRole("button", { name: /Bike \(2\)/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /MountainBikeRide|GravelRide/ })).toBeNull();
  });
});


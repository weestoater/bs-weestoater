import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FootballPage } from "../../pages/Football";

// Mock season data from database
const mockSeasonData = {
  season: "2025-26",
  matches: [
    {
      match_date: "2025-08-01",
      opposition: "Celtic",
      venue: "Home",
      goals_scored: 2,
      goals_conceded: 1,
      league: "SPFL Premiership",
      video_url: null,
      iplayer_url: null,
      notes: null,
      goals: [
        { player: "Player One", minute: 15, assist: null },
        { player: "Player Two", minute: 45, assist: "Player One" },
      ],
      cards: [],
    },
  ],
  topScorers: [
    { player: "Player One", goals: 10, assists: 5 },
    { player: "Player Two", goals: 8, assists: 3 },
  ],
};

const mockGetFootballSeasons = vi
  .fn()
  .mockResolvedValue([{ season_id: "2025-26", display_name: "2025-26" }]);
const mockGetFootballSeasonComplete = vi.fn().mockResolvedValue(mockSeasonData);

vi.mock("../../../backend/index.js", () => ({
  getSupabaseClient: vi.fn(() => ({})),
  createDatabaseService: vi.fn(() => ({
    getFootballSeasons: mockGetFootballSeasons,
    getFootballSeasonComplete: mockGetFootballSeasonComplete,
  })),
}));

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../components/global/BackToTop", () => ({
  BackToTop: () => <div data-testid="back-to-top">Back to Top</div>,
}));

vi.mock("../../content/football/footballIntro", () => ({
  FootballIntro: () => <div data-testid="football-intro">Football Intro</div>,
}));

vi.mock("../../components/football/footballSeasonResults", () => ({
  FootballSeasonResults: ({
    season,
    matches,
    goals,
  }: {
    season: string[];
    matches: object[];
    goals: object[];
  }) => (
    <div data-testid="football-season-results">
      <span>Season: {season.join(", ")}</span>
      <span>Has Matches: {matches ? "Yes" : "No"}</span>
      <span>Has Goals: {goals ? "Yes" : "No"}</span>
    </div>
  ),
}));

vi.mock("../../components/global/SkeletonLoaders", () => ({
  SkeletonCard: () => <div data-testid="skeleton-loader">Loading...</div>,
}));

describe("FootballPage", () => {
  it("shows loading skeleton initially", () => {
    render(<FootballPage />);
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("renders the page with correct title after loading", async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Motherwell FC Stats & Results"),
      ).toBeInTheDocument();
    });
  });

  it("renders football intro section after loading", async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(screen.getByTestId("football-intro")).toBeInTheDocument();
    });
  });

  it("renders football season results with correct data", async () => {
    render(<FootballPage />);

    await waitFor(() => {
      const resultsSection = screen.getByTestId("football-season-results");
      expect(resultsSection).toBeInTheDocument();
    });

    expect(screen.getByText("Season: 2025-26")).toBeInTheDocument();
    expect(screen.getByText("Has Matches: Yes")).toBeInTheDocument();
    expect(screen.getByText("Has Goals: Yes")).toBeInTheDocument();
  });

  it("renders in the container-fluid layout after loading", async () => {
    const { container } = render(<FootballPage />);

    await waitFor(() => {
      expect(container.querySelector(".container-fluid")).toBeInTheDocument();
    });
  });

  it("calls database service with correct season", async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(mockGetFootballSeasonComplete).toHaveBeenCalledWith("2025-26");
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballSeason202425 } from "../../pages/2024-25-season";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/football/footballSeasonsNav", () => ({
  FootballSeasonsNav: () => (
    <div data-testid="seasons-nav">Seasons Navigation</div>
  ),
}));

vi.mock("../../components/football/footballSeasonResults", () => ({
  FootballSeasonResults: ({
    season,
    matches,
    goals,
  }: {
    season: string[];
    matches: any;
    goals: any;
  }) => (
    <div data-testid="season-results">
      <span>Season: {season.join(", ")}</span>
      <span>Has Matches: {matches ? "Yes" : "No"}</span>
      <span>Has Goals: {goals ? "Yes" : "No"}</span>
    </div>
  ),
}));

// Mock the JSON imports
vi.mock("../../data/2024-25-goals.json", () => ({
  default: [{ some: "goals data" }],
}));

vi.mock("../../data/2024-25-matches.json", () => ({
  default: [{ some: "matches data" }],
}));

describe("FootballSeason202425", () => {
  it("renders the page with correct title", () => {
    render(<FootballSeason202425 />);
    expect(screen.getByText("Previous Football Seasons")).toBeInTheDocument();
  });

  it("renders seasons navigation", () => {
    render(<FootballSeason202425 />);
    expect(screen.getByTestId("seasons-nav")).toBeInTheDocument();
  });

  it("renders season results with correct data", () => {
    render(<FootballSeason202425 />);
    const resultsSection = screen.getByTestId("season-results");
    expect(resultsSection).toBeInTheDocument();
    expect(screen.getByText("Season: 2024-2025")).toBeInTheDocument();
    expect(screen.getByText("Has Matches: Yes")).toBeInTheDocument();
    expect(screen.getByText("Has Goals: Yes")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<FootballSeason202425 />);
    expect(container.querySelector(".container-fluid")).toBeInTheDocument();
    expect(container.querySelector(".previous-seasons")).toBeInTheDocument();
  });
});

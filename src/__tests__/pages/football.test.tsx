import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballPage } from "../../pages/Football";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
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

// Mock the JSON imports
vi.mock("../../data/2025-26-goals.json", () => ({
  default: [{ some: "goals data" }],
}));

vi.mock("../../data/2025-26-matches.json", () => ({
  default: [{ some: "matches data" }],
}));

describe("FootballPage", () => {
  it("renders the page with correct title", () => {
    render(<FootballPage />);
    expect(screen.getByText("Football")).toBeInTheDocument();
  });

  it("renders football intro section", () => {
    render(<FootballPage />);
    expect(screen.getByTestId("football-intro")).toBeInTheDocument();
  });

  it("renders football season results with correct data", () => {
    render(<FootballPage />);
    const resultsSection = screen.getByTestId("football-season-results");
    expect(resultsSection).toBeInTheDocument();
    expect(screen.getByText("Season: 2025-2026")).toBeInTheDocument();
    expect(screen.getByText("Has Matches: Yes")).toBeInTheDocument();
    expect(screen.getByText("Has Goals: Yes")).toBeInTheDocument();
  });

  it("renders in the container-fluid layout", () => {
    const { container } = render(<FootballPage />);
    expect(container.querySelector(".container-fluid")).toBeInTheDocument();
  });
});

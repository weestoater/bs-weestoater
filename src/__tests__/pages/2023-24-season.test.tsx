import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballSeason202324 } from "../../pages/2023-24-season";
import { FootballSeasonResultsProps } from "../test-types";
import { TestWrapper } from "../testUtils";

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
  }: FootballSeasonResultsProps) => (
    <div data-testid="season-results">
      <span>Season: {season.join(", ")}</span>
      <span>Has Matches: {matches ? "Yes" : "No"}</span>
      <span>Has Goals: {goals ? "Yes" : "No"}</span>
    </div>
  ),
}));

// Mock the JSON imports
vi.mock("../../data/2023-24-goals.json", () => ({
  default: [
    {
      details: [{ player: "Test Player", goals: 1, assists: 0 }],
    },
  ],
}));

vi.mock("../../data/2023-24-matches.json", () => ({
  default: [
    {
      details: [
        {
          date: "2023-08-01",
          opposition: "Test Team",
          venue: "home",
          scored: 2,
          conceded: 1,
        },
      ],
    },
  ],
}));

describe("FootballSeason202324", () => {
  it("renders the page with correct title", () => {
    render(
      <TestWrapper>
        <FootballSeason202324 />
      </TestWrapper>
    );
    expect(screen.getByText("Previous Football Seasons")).toBeInTheDocument();
  });

  it("renders seasons navigation", () => {
    render(
      <TestWrapper>
        <FootballSeason202324 />
      </TestWrapper>
    );
    expect(screen.getByTestId("seasons-nav")).toBeInTheDocument();
  });

  it("renders season results with correct data", () => {
    render(
      <TestWrapper>
        <FootballSeason202324 />
      </TestWrapper>
    );
    const resultsSection = screen.getByTestId("season-results");
    expect(resultsSection).toBeInTheDocument();
    expect(screen.getByText("Season: 2023-2024")).toBeInTheDocument();
    expect(screen.getByText("Has Matches: Yes")).toBeInTheDocument();
    expect(screen.getByText("Has Goals: Yes")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(
      <TestWrapper>
        <FootballSeason202324 />
      </TestWrapper>
    );
    expect(container.querySelector(".container-fluid")).toBeInTheDocument();
    expect(container.querySelector(".previous-seasons")).toBeInTheDocument();
  });
});

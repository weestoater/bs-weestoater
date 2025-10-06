import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballSeasonResults } from "../../components/football/footballSeasonResults";

// Mock the child components to avoid ag-charts issues
vi.mock("../../components/football/goalScorerDetails", () => ({
  GoalScorerDetails: () => (
    <div data-testid="goal-scorer-details">Goal Scorer Details</div>
  ),
}));

vi.mock("../../components/football/matchDetails", () => ({
  MatchDetails: () => <div data-testid="match-details">Match Details</div>,
}));

describe("FootballSeasonResults", () => {
  const mockGoals = [
    {
      details: [{ player: "John", goals: 5, assists: 2 }],
    },
  ];

  const mockMatches = [
    {
      details: [
        {
          date: "01/01/2024",
          venue: "home",
          opponent: "Team A",
          scored: 2,
          conceded: 1,
          notes: "Great game",
        },
      ],
    },
  ];

  it("renders with data", () => {
    render(
      <FootballSeasonResults
        goals={mockGoals}
        matches={mockMatches}
        season={["2023-24"]}
      />
    );

    expect(screen.getByText("2023-24 Matches")).toBeInTheDocument();
    expect(screen.getByText("2023-24 Goals")).toBeInTheDocument();
    expect(screen.getByTestId("match-details")).toBeInTheDocument();
    expect(screen.getByTestId("goal-scorer-details")).toBeInTheDocument();
  });

  it("renders with no data", () => {
    render(<FootballSeasonResults />);

    expect(
      screen.getByText("Football Season Results Matches")
    ).toBeInTheDocument();
    expect(screen.getByText("No match data found")).toBeInTheDocument();
    expect(screen.getByText("No goals data found")).toBeInTheDocument();
  });

  it("renders with partial data (only matches)", () => {
    render(
      <FootballSeasonResults matches={mockMatches} season={["2023-24"]} />
    );

    expect(screen.getByText("2023-24 Matches")).toBeInTheDocument();
    expect(screen.getByTestId("match-details")).toBeInTheDocument();
    expect(screen.getByText("No goals data found")).toBeInTheDocument();
  });

  it("renders with partial data (only goals)", () => {
    render(<FootballSeasonResults goals={mockGoals} season={["2023-24"]} />);

    expect(screen.getByText("2023-24 Matches")).toBeInTheDocument();
    expect(screen.getByText("No match data found")).toBeInTheDocument();
    expect(screen.getByTestId("goal-scorer-details")).toBeInTheDocument();
  });
});

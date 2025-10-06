import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchDetails } from "../../components/football/matchDetails";

describe("MatchDetails", () => {
  const mockMatchWithAllDetails = {
    venue: "Home",
    opposition: "Team A",
    conceded: 1,
    scored: 2,
    date: "01/01/2024",
    league: "Premier League",
    video: "https://example.com/video",
    goals: [
      { minute: 15, scorer: "Player 1", assist: "Player 2" },
      { minute: 75, scorer: "Player 3", assist: undefined },
    ],
    cards: [{ type: "yellow", player: "Player 4", minute: 30 }],
    notes: "Great performance by the team",
  };

  it("renders match details with all optional elements", () => {
    render(<MatchDetails details={[mockMatchWithAllDetails]} />);

    // Check basic match info
    expect(screen.getByText("Home to Team A")).toBeInTheDocument();
    expect(screen.getByText("Premier League")).toBeInTheDocument();
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();

    // Check optional elements
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
    expect(screen.getByText(/Player 3/)).toBeInTheDocument();
    expect(screen.getByText(/Player 4/)).toBeInTheDocument();
    expect(
      screen.getByText("Great performance by the team")
    ).toBeInTheDocument();
  });

  const mockMatchMinimalDetails = {
    venue: "Away",
    opposition: "Team B",
    conceded: 0,
    scored: 1,
    date: "15/01/2024",
  };

  it("renders match details with minimal information", () => {
    render(<MatchDetails details={[mockMatchMinimalDetails]} />);

    // Check basic match info
    expect(screen.getByText("Away to Team B")).toBeInTheDocument();
    expect(screen.getByText("SPFL")).toBeInTheDocument();
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();

    // Optional elements should not be present
    expect(screen.queryByText(/Watch Highlights/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Goals/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cards/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Notes/i)).not.toBeInTheDocument();
  });

  it("renders multiple matches", () => {
    const matches = [mockMatchWithAllDetails, mockMatchMinimalDetails];
    render(<MatchDetails details={matches} />);

    expect(screen.getByText("Home to Team A")).toBeInTheDocument();
    expect(screen.getByText("Away to Team B")).toBeInTheDocument();
  });

  it("handles null details prop", () => {
    render(<MatchDetails details={null} />);
    expect(screen.queryByText(/to/)).not.toBeInTheDocument();
  });
});

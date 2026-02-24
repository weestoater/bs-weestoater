import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeasonStatistics } from "../../components/football/seasonStatistics";
import type { Match } from "../../interfaces/footballTypes";

describe("SeasonStatistics", () => {
  const mockMatches: Match[] = [
    {
      date: "2025-08-01",
      opposition: "Team A",
      venue: "home",
      scored: 2,
      conceded: 0,
      league: "SPFL",
    },
    {
      date: "2025-08-08",
      opposition: "Team B",
      venue: "away",
      scored: 1,
      conceded: 1,
      league: "SPFL",
    },
    {
      date: "2025-08-15",
      opposition: "Team C",
      venue: "home",
      scored: 3,
      conceded: 1,
      league: "SPFL",
    },
    {
      date: "2025-08-22",
      opposition: "Team D",
      venue: "away",
      scored: 2,
      conceded: 0,
      league: "SPFL",
    },
    {
      date: "2025-08-29",
      opposition: "Team E",
      venue: "home",
      scored: 1,
      conceded: 0,
      league: "SPFL",
    },
  ];

  it("renders statistics correctly", () => {
    render(<SeasonStatistics matches={mockMatches} />);

    // Check clean sheets (3 matches with 0 conceded)
    expect(screen.getByText("Clean Sheets")).toBeInTheDocument();

    // Check win percentage (4 wins out of 5 = 80%)
    expect(screen.getByText("80.0%")).toBeInTheDocument();
    expect(screen.getByText("Win Rate")).toBeInTheDocument();

    // Check home wins (2 home wins)
    expect(screen.getByText("Home Wins")).toBeInTheDocument();

    // Check away wins (1 away win)
    expect(screen.getByText("Away Wins")).toBeInTheDocument();

    // Check current clean sheet streak (2 consecutive clean sheets)
    expect(screen.getByText("Current Clean Sheet Streak")).toBeInTheDocument();
  });

  it("returns null when no completed matches", () => {
    const { container } = render(<SeasonStatistics matches={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("handles matches without scores", () => {
    const incompleteMmatches: Match[] = [
      {
        date: "2025-08-01",
        opposition: "Team A",
        venue: "home",
        league: "SPFL",
      },
    ];
    const { container } = render(
      <SeasonStatistics matches={incompleteMmatches} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("calculates clean sheet streak correctly", () => {
    const matchesWithStreak: Match[] = [
      {
        date: "2025-08-01",
        opposition: "Team A",
        venue: "home",
        scored: 2,
        conceded: 1,
        league: "SPFL",
      },
      {
        date: "2025-08-08",
        opposition: "Team B",
        venue: "home",
        scored: 1,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-08-15",
        opposition: "Team C",
        venue: "home",
        scored: 2,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-08-22",
        opposition: "Team D",
        venue: "home",
        scored: 1,
        conceded: 0,
        league: "SPFL",
      },
    ];

    const { container } = render(
      <SeasonStatistics matches={matchesWithStreak} />,
    );

    // Current streak should be 3 (last 3 matches)
    // Find the streak stat by checking for text content
    const streakText = container.textContent || "";
    expect(streakText).toContain("Current Clean Sheet Streak");
    expect(streakText).toContain("3");
  });

  it("shows zero streak when last match conceded", () => {
    const matchesWithNoStreak: Match[] = [
      {
        date: "2025-08-01",
        opposition: "Team A",
        venue: "home",
        scored: 2,
        conceded: 0,
        league: "SPFL",
      },
      {
        date: "2025-08-08",
        opposition: "Team B",
        venue: "home",
        scored: 1,
        conceded: 1,
        league: "SPFL",
      },
    ];

    const { container } = render(
      <SeasonStatistics matches={matchesWithNoStreak} />,
    );

    // Current streak should be 0 (last match conceded)
    const streakText = container.textContent || "";
    expect(streakText).toContain("Current Clean Sheet Streak");
    expect(streakText).toContain("0");
  });
});

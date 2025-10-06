import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ScoreDetails } from "../../components/football/scoreDetails";

interface TestScenario {
  scored: number;
  conceded: number;
  venue: "Home" | "Away";
  expectedResult: RegExp;
  expectedScore: RegExp;
}

describe("Score Details component", () => {
  const renderScoreDetails = ({
    scored,
    conceded,
    venue,
    expectedResult,
    expectedScore,
  }: TestScenario) => {
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(expectedResult);
    const finalScore = screen.getByText(expectedScore);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  };

  test("can calculate a win at home", () => {
    renderScoreDetails({
      scored: 5,
      conceded: 0,
      venue: "Home",
      expectedResult: /win/i,
      expectedScore: /5 - 0/i,
    });
  });

  test("can calculate a draw at home", () => {
    renderScoreDetails({
      scored: 6,
      conceded: 6,
      venue: "Home",
      expectedResult: /draw/i,
      expectedScore: /6 - 6/i,
    });
  });

  test("can calculate a loss at home", () => {
    renderScoreDetails({
      scored: 0,
      conceded: 3,
      venue: "Home",
      expectedResult: /lost/i,
      expectedScore: /0 - 3/i,
    });
  });

  test("can calculate a win away", () => {
    renderScoreDetails({
      scored: 5,
      conceded: 0,
      venue: "Away",
      expectedResult: /win/i,
      expectedScore: /0 - 5/i,
    });
  });

  test("can calculate a draw away", () => {
    renderScoreDetails({
      scored: 3,
      conceded: 3,
      venue: "Away",
      expectedResult: /draw/i,
      expectedScore: /3 - 3/i,
    });
  });

  test("can calculate a loss away", () => {
    renderScoreDetails({
      scored: 0,
      conceded: 2,
      venue: "Away",
      expectedResult: /lost/i,
      expectedScore: /2 - 0/i,
    });
  });
});

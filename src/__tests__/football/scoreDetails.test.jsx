import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { ScoreDetails } from "../../components/football/scoreDetails";

describe("Score Details component", () => {
  test("can calculate a win at home", () => {
    const scored = 5;
    const conceded = 0;
    const venue = "Home";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/win/i);
    const finalScore = screen.getByText(/5 - 0/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });

  test("can calculate a draw at home", () => {
    const scored = 6;
    const conceded = 6;
    const venue = "Home";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/draw/i);
    const finalScore = screen.getByText(/6 - 6/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });

  test("can calculate a loss at home", () => {
    const scored = 0;
    const conceded = 3;
    const venue = "Home";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/lost/i);
    const finalScore = screen.getByText(/0 - 3/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });

  test("can calculate a win away", () => {
    const scored = 5;
    const conceded = 0;
    const venue = "Away";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/win/i);
    const finalScore = screen.getByText(/0 - 5/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });

  test("can calculate a draw away", () => {
    const scored = 3;
    const conceded = 3;
    const venue = "Away";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/draw/i);
    const finalScore = screen.getByText(/3 - 3/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });

  test("can calculate a loss away", () => {
    const scored = 0;
    const conceded = 2;
    const venue = "Away";
    render(<ScoreDetails conceded={conceded} scored={scored} venue={venue} />);
    const result = screen.getByText(/lost/i);
    const finalScore = screen.getByText(/2 - 0/i);
    expect(result).toBeInTheDocument();
    expect(finalScore).toBeInTheDocument();
  });
});

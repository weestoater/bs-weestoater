import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { GoalsDetails } from "../../components/football/goalsDetails";

describe("Goals Details component", () => {
  test("Can show a goal scorer and his time", () => {
    const mockGoals = [{ player: "Mickey Mouse", mins: "5" }];
    render(<GoalsDetails goals={mockGoals} />);
    const player = screen.getByText(/mickey mouse/i);
    const time = screen.getByText(/5/i);

    expect(player).toBeInTheDocument();
    expect(time).toBeInTheDocument();
  });
});

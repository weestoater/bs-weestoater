import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GoalScorersGrid } from "../../../components/football/goalScorersGrid";

const mockGoalScorers = [
  {
    player: "John Doe",
    goals: 15,
    assists: 8,
  },
  {
    player: "Jane Smith",
    goals: 10,
    assists: 5,
  },
];

describe("GoalScorersGrid", () => {
  it("renders the grid container", () => {
    const { container } = render(<GoalScorersGrid details={mockGoalScorers} />);
    expect(container.querySelector(".goal-scorers-grid")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(<GoalScorersGrid details={[]} />);
    expect(container.querySelector(".goal-scorers-grid")).toBeInTheDocument();
  });

  it("shows loading spinner initially", () => {
    render(<GoalScorersGrid details={mockGoalScorers} />);
    expect(screen.getByText(/loading grid/i)).toBeInTheDocument();
  });

  it("has spinner with proper accessibility", () => {
    render(<GoalScorersGrid details={mockGoalScorers} />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });
});

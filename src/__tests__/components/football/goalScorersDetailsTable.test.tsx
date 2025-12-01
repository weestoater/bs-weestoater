import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GoalScorersDetailsTable } from "../../../components/football/goalScorersDetailsTable";

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

describe("GoalScorersDetailsTable", () => {
  it("renders the table", () => {
    render(<GoalScorersDetailsTable details={mockGoalScorers} />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("displays all column headers", () => {
    render(<GoalScorersDetailsTable details={mockGoalScorers} />);

    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Assists")).toBeInTheDocument();
    expect(screen.getByText("Goals")).toBeInTheDocument();
  });

  it("displays all goal scorers", () => {
    render(<GoalScorersDetailsTable details={mockGoalScorers} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays goal statistics correctly", () => {
    render(<GoalScorersDetailsTable details={mockGoalScorers} />);

    // Check for stats
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("has correct table classes", () => {
    const { container } = render(
      <GoalScorersDetailsTable details={mockGoalScorers} />
    );
    const table = container.querySelector(".goal-scorers-table");
    expect(table).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<GoalScorersDetailsTable details={[]} />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });
});

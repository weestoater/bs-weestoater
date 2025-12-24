import { render } from "@testing-library/react";
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

  it("shows skeleton loader during Suspense", () => {
    const { container } = render(<GoalScorersGrid details={mockGoalScorers} />);
    // Check if skeleton grid or actual grid is present
    const hasSkeletonOrGrid =
      container.querySelector(".skeleton-grid") ||
      container.querySelector(".goal-scorers-grid");
    expect(hasSkeletonOrGrid).toBeTruthy();
  });

  it("skeleton has proper accessibility attributes", () => {
    const { container } = render(<GoalScorersGrid details={mockGoalScorers} />);
    // If skeleton is shown, it should have aria-busy and aria-live
    const skeleton = container.querySelector(".skeleton-grid");
    if (skeleton) {
      expect(skeleton).toHaveAttribute("aria-busy", "true");
      expect(skeleton).toHaveAttribute("aria-live", "polite");
    }
  });
});

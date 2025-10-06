import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LessonsLearned from "../../content/agile/lessonslearned";

describe("LessonsLearned", () => {
  it("renders main heading", () => {
    render(<LessonsLearned />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("renders some expected content", () => {
    render(<LessonsLearned />);
    expect(screen.getByText(/lesson/i)).toBeInTheDocument();
  });
});

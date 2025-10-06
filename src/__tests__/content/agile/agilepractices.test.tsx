import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AgilePractices from "../../content/agile/agilepractices";

describe("AgilePractices", () => {
  it("renders main heading", () => {
    render(<AgilePractices />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("renders some expected content", () => {
    render(<AgilePractices />);
    expect(screen.getByText(/agile/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AgilePracticesContent } from "../../../content/agile/agilepractices";

describe("AgilePractices", () => {
  it("renders the card with correct title", () => {
    render(<AgilePracticesContent />);
    expect(screen.getByText(/Agile practices/i)).toBeInTheDocument();
  });

  it("displays agile content", () => {
    render(<AgilePracticesContent />);

    expect(screen.getByText(/stand ups/i)).toBeInTheDocument();
    expect(screen.getByText(/pair programming/i)).toBeInTheDocument();
  });

  it("has correct card structure", () => {
    const { container } = render(<AgilePracticesContent />);
    const card = container.querySelector(".card");
    expect(card).toBeInTheDocument();
    expect(card?.querySelector(".card-header")).toBeInTheDocument();
    expect(card?.querySelector(".card-body")).toBeInTheDocument();
  });

  it("includes agile image", () => {
    const { container } = render(<AgilePracticesContent />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("fluid");
  });
});

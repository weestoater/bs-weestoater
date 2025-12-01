import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LessonsLearnedContent } from "../../../content/agile/lessonslearned";

describe("LessonsLearnedContent", () => {
  it("renders the card with correct title", () => {
    render(<LessonsLearnedContent />);
    expect(screen.getByText("Lessons Learned")).toBeInTheDocument();
  });

  it("displays lessons learned image", () => {
    const { container } = render(<LessonsLearnedContent />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
  });

  it("has correct card structure", () => {
    const { container } = render(<LessonsLearnedContent />);
    const card = container.querySelector(".card");
    expect(card).toBeInTheDocument();
    expect(card?.querySelector(".card-header")).toBeInTheDocument();
    expect(card?.querySelector(".card-body")).toBeInTheDocument();
  });

  it("includes content about lessons", () => {
    const { container } = render(<LessonsLearnedContent />);
    const cardBody = container.querySelector(".card-body");
    expect(cardBody).toBeInTheDocument();
    expect(cardBody?.textContent).toBeTruthy();
  });

  it("renders image with correct classes", () => {
    const { container } = render(<LessonsLearnedContent />);
    const image = container.querySelector("img");
    expect(image).toHaveClass("fluid");
  });
});

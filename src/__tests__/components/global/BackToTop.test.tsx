import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BackToTop } from "../../../components/global/BackToTop";

describe("BackToTop", () => {
  it("renders the back to top button", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", {
      name: /scroll back to top of page/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("displays the correct text", () => {
    render(<BackToTop />);
    expect(screen.getByText("Back to Top")).toBeInTheDocument();
  });

  it("has the correct CSS classes", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn", "btn-outline-secondary");
  });

  it("scrolls to top when clicked", async () => {
    const user = userEvent.setup();
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);
    const button = screen.getByRole("button");
    await user.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("has an icon with aria-hidden", () => {
    const { container } = render(<BackToTop />);
    const icon = container.querySelector(".bi-arrow-up-circle");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("has proper accessibility attributes", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Scroll back to top of page");
  });
});

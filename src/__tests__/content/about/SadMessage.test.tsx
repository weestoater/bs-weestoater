import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SadMessage } from "../../../content/about/SadMessage";

describe("SadMessage", () => {
  it("renders the card with correct header", () => {
    render(<SadMessage />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/I'm free/);
  });

  it("includes heart balloon icon in header", () => {
    const { container } = render(<SadMessage />);
    expect(container.querySelector(".bi-balloon-heart")).toBeInTheDocument();
  });

  it("renders introductory paragraphs about loss", () => {
    render(<SadMessage />);
    expect(
      screen.getByText(/Sadly in life, from time to time/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/In my case I've lost both my own father/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/This verse was included/i)).toBeInTheDocument();
  });

  it("renders the memorial poem in a blockquote", () => {
    const { container } = render(<SadMessage />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveClass("sad");
    expect(blockquote).toHaveTextContent("Don't grieve for me now I'm free");
    expect(blockquote).toHaveTextContent("God wanted me now, He set me free");
  });

  it("renders with correct card structure", () => {
    const { container } = render(<SadMessage />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });

  it("uses proper semantic structure with blockquote for poem", () => {
    const { container } = render(<SadMessage />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveClass("sad");
  });
});

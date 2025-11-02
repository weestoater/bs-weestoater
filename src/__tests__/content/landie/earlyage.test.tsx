import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { EarlyAge } from "../../../content/landie/earlyage";

// Mock the image imports
vi.mock("../../../assets/img/Landie/lightweight.jpg", () => ({
  default: "lightweight.jpg",
}));
vi.mock("../../../assets/img/Landie/lightweight.webp", () => ({
  default: "lightweight.webp",
}));

describe("Early Age Content", () => {
  test("renders heading with icon", () => {
    render(<EarlyAge />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("Early age");
    expect(heading.innerHTML).toContain('class="bi bi-emoji-heart-eyes');
  });

  test("renders card structure with RAF image", () => {
    const { container } = render(<EarlyAge />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();

    // Test picture element with WebP support
    const picture = container.querySelector("picture");
    expect(picture).toBeInTheDocument();
    const source = picture?.querySelector("source");
    expect(source).toHaveAttribute("srcSet", "lightweight.webp");
    expect(source).toHaveAttribute("type", "image/webp");

    const img = screen.getByAltText(
      /Land Rover Lightweight in Royal Air Force/i
    );
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "lightweight.jpg");
    expect(img).toHaveAttribute("class", "fluid");
  });

  test("renders Air Cadets story", () => {
    render(<EarlyAge />);
    expect(screen.getByText(/Air Cadets/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Royal Air Force bases, Kinloss/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Land Rover Series II Lightweight/i)
    ).toBeInTheDocument();
  });
});

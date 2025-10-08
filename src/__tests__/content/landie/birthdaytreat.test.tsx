import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { BirthdayTreat } from "../../../content/landie/birthdaytreat";

// Mock the image imports
vi.mock("../../../assets/img/Landie/2011/cimg2840.jpg", () => ({
  default: "cimg2840.jpg",
}));
vi.mock("../../../assets/img/Landie/2011/cimg2870.jpg", () => ({
  default: "cimg2870.jpg",
}));
vi.mock("../../../assets/img/Landie/2011/cimg2884.jpg", () => ({
  default: "cimg2884.jpg",
}));
vi.mock("../../../assets/img/Landie/2011/cimg2890.jpg", () => ({
  default: "cimg2890.jpg",
}));
vi.mock("../../../assets/img/Landie/2011/cimg2894.jpg", () => ({
  default: "cimg2894.jpg",
}));

describe("Birthday Treat Content", () => {
  test("renders heading with icon", () => {
    render(<BirthdayTreat />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("Birthday Treat 1");
    expect(heading.innerHTML).toContain('class="bi bi-cake2');
  });

  test("renders card structure with main image", () => {
    const { container } = render(<BirthdayTreat />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
    const img = screen.getByAltText(/Me in the passenger seat/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "cimg2840.jpg");
    expect(img).toHaveAttribute("class", "fluid");
  });

  test("renders birthday experience story", () => {
    render(<BirthdayTreat />);
    expect(screen.getByText(/Land Rover Defender/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Highland Safaris, Aberfeldy/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/39th birthday/i)).toBeInTheDocument();
    expect(
      screen.getByText(/dark green LWB 110 Defender/i)
    ).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhoIsWeestoater } from "../../../content/about/WhoIsWeestoater";

// Mock the image imports
vi.mock("../../../assets/img/burt.png", () => {
  return {
    default: "burt-avatar.png",
  };
});

vi.mock("../../../assets/img/buster.jpg", () => {
  return {
    default: "buster-image.jpg",
  };
});

vi.mock("../../../assets/img/buster.webp", () => {
  return {
    default: "buster-image.webp",
  };
});

describe("WhoIsWeestoater", () => {
  it("renders the card with correct header", () => {
    render(<WhoIsWeestoater />);
    expect(screen.getByText("who is weestoater")).toBeInTheDocument();
  });

  it("renders avatar image with correct alt text", () => {
    render(<WhoIsWeestoater />);
    const avatar = screen.getByRole("img", { name: "avatar of weestoater" });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("shape-circle");
    expect(avatar).toHaveClass("shape-md");
  });

  it("renders Buster's image with correct alt text", () => {
    render(<WhoIsWeestoater />);
    const busterImage = screen.getByRole("img", {
      name: "Our golden lab Buster",
    });
    expect(busterImage).toBeInTheDocument();
    expect(busterImage).toHaveClass("fluid");
  });

  it("renders all paragraphs of content", () => {
    render(<WhoIsWeestoater />);
    expect(screen.getByText(/I am Ian Burrett/)).toBeInTheDocument();
    expect(
      screen.getByText(/I'm a father of two amazing kids/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/When not working or ferrying my kids/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I occassionaly make it along to see Motherwell FC/)
    ).toBeInTheDocument();
  });

  it("renders with correct card structure", () => {
    const { container } = render(<WhoIsWeestoater />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });

  it("includes the person badge icon", () => {
    const { container } = render(<WhoIsWeestoater />);
    expect(container.querySelector(".bi-person-badge")).toBeInTheDocument();
  });
});

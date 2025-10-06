import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatIsWeestoater } from "../../../content/about/WhatIsWeestoater";

// Mock the image import
vi.mock("../../../assets/img/vs-code.png", () => ({
  default: "vs-code-screenshot.png",
}));

describe("WhatIsWeestoater", () => {
  it("renders the card with correct header", () => {
    render(<WhatIsWeestoater />);
    expect(
      screen.getByRole("heading", { level: 2, name: /what is weestoater/i })
    ).toBeInTheDocument();
  });

  it("renders VS Code screenshot with correct alt text", () => {
    render(<WhatIsWeestoater />);
    const image = screen.getByRole("img", { name: "code example in VS Code" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("fluid");
  });

  it("renders introductory paragraph with correct content", () => {
    const { container } = render(<WhatIsWeestoater />);
    const paragraph = container.querySelector(".card-body p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(/weestoater.*nickname/i);
    expect(paragraph).toHaveTextContent(/html/i);
    expect(paragraph).toHaveTextContent(/design/i);
  });

  it("renders list of previous technologies used", () => {
    render(<WhatIsWeestoater />);
    const technologies = [
      "A hand rolled CMS on php",
      "Numerous versions of WordPress",
      "An umbraco site, didn't last long",
      "A few Angular / AngularJS versions",
      "A couple of React sites",
    ];

    technologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it("renders current technology stack information", () => {
    render(<WhatIsWeestoater />);
    expect(
      screen.getByText(/This current version is ReactJS and Bootstrap/i)
    ).toBeInTheDocument();
  });

  it("renders testing and accessibility paragraph with external link", () => {
    render(<WhatIsWeestoater />);
    const link = screen.getByRole("link", { name: "testing javascript" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "http://www.testingjavascript.com/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders with correct card structure", () => {
    const { container } = render(<WhatIsWeestoater />);
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-header")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });

  it("includes Bootstrap icon in header", () => {
    const { container } = render(<WhatIsWeestoater />);
    expect(container.querySelector(".bi-journal-code")).toBeInTheDocument();
  });
});

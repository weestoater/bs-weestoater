import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballSeasonsNav } from "../../../content/football/footballSeasonsNav";
import { TestWrapper } from "../../testUtils";

describe("FootballSeasonsNav", () => {
  it("renders navigation links for all seasons", () => {
    render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>
    );

    // Check for all season links with dynamic routes
    expect(screen.getByText("2025-26")).toHaveAttribute("href", "/football");
    expect(screen.getByText("2024-25")).toHaveAttribute(
      "href",
      "/season/2024-25"
    );
    expect(screen.getByText("2023-24")).toHaveAttribute(
      "href",
      "/season/2023-24"
    );
    expect(screen.getByText("2022-23")).toHaveAttribute(
      "href",
      "/season/2022-23"
    );
    expect(screen.getByText("2021-22")).toHaveAttribute(
      "href",
      "/season/2021-22"
    );
    expect(screen.getByText("2020-21")).toHaveAttribute(
      "href",
      "/season/2020-21"
    );
  });

  it("renders with correct class for navigation list", () => {
    const { container } = render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>
    );

    expect(container.querySelector(".seasons-nav")).toBeInTheDocument();
  });

  it("renders correct number of navigation items", () => {
    render(
      <TestWrapper>
        <FootballSeasonsNav />
      </TestWrapper>
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(6);
  });
});

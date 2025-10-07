import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootballIntro } from "../../../content/football/footballIntro";
import { TestWrapper } from "../../testUtils";

describe("FootballIntro", () => {
  it("renders Motherwell references", () => {
    render(
      <TestWrapper>
        <FootballIntro />
      </TestWrapper>
    );

    // Check for Motherwell in supporter text
    expect(screen.getByText(/I'm a Motherwell supporter/i)).toBeInTheDocument();

    // Check for Motherwell F.C. in image alt text
    expect(screen.getByAltText(/Motherwell F\.C\. logo/i)).toBeInTheDocument();
  });

  it("renders introduction content", () => {
    render(
      <TestWrapper>
        <FootballIntro />
      </TestWrapper>
    );

    // Check for other key content
    expect(screen.getByText(/6-6/i)).toBeInTheDocument();
    expect(screen.getByText(/draw with Hibs/i)).toBeInTheDocument();
    expect(screen.getByText(/Stranraer/i)).toBeInTheDocument();
  });
});

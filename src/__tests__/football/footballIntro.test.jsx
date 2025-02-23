import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { FootballIntro } from "../../content/football/footballIntro";

describe("Football Intro content", () => {
  test("mentions Motherwell", () => {
    render(<FootballIntro />);
    const intro = screen.getByText(/motherwell/i);
    expect(intro).toBeInTheDocument();
  });

  test("has Motherwell F.C. badge", () => {
    render(<FootballIntro />);
    const altTag = screen.getByAltText(/motherwell f.c. logo/i);
    expect(altTag).toBeInTheDocument();
  })
});

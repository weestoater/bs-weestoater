import { render, screen } from "../../utils/test-utils";
import { describe, test, expect } from "vitest";
import { FootballIntro } from "../../components/football/FootballIntro";

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
  });
});

import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { HomePage } from "../pages/Home";

describe("Home page", () => {
  test("renders h1 correctly ", () => {
    render(<HomePage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
  });

  test("has a card titled Ethos", () => {
    render(<HomePage />);
    const heading = screen.getByText(/ethos/i);
    expect(heading).toBeInTheDocument();
  });

  test("has a card titled trial and error", () => {
    render(<HomePage />);
    const heading = screen.getByText(/trial & error/i);
    expect(heading).toBeInTheDocument();
  });
});

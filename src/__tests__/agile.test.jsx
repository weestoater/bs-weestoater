import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { AgilePage } from "../pages/Agile";

describe("Agile page", () => {
  test("renders h1 correctly", () => {
    render(<AgilePage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
  });
});

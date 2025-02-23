import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { AboutPage } from "../pages/About";

describe("About page", () => {
  test("renders h1 correctly", () => {
    render(<AboutPage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
  });

  test("renders what is weestoater heading", () => {
    render(<AboutPage />);
    const heading = screen.getByText(/what is weestoater/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders who is weestoater heading", () => {
    render(<AboutPage />);
    const heading = screen.getByText(/who is weestoater/i);
    expect(heading).toBeInTheDocument();
  });
});

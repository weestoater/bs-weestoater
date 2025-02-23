import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { ReactPage } from "../pages/React";

describe("React page", () => {
  test("renders h1 correctly", () => {
    render(<ReactPage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
  });

  test("renders vite & react-ts", () => {
    render(<ReactPage />);
    const heading = screen.getByText(/vite & react-ts/i);
    expect(heading).toBeInTheDocument();
  });
  test("renders needs a little salt", () => {
    render(<ReactPage />);
    const heading = screen.getByText(/needs a little salt/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders nextjs things next", () => {
    render(<ReactPage />);
    const heading = screen.getByText(/nextjs things next/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders hook, line & sinker", () => {
    render(<ReactPage />);
    const heading = screen.getByText(/hook, line & sinker/i);
    expect(heading).toBeInTheDocument();
  });
});

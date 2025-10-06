import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Header } from "../../patterns/appheader";
import { TestWrapper } from "../testUtils";

describe("AppHeader pattern", () => {
  test("has weestoater branding", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const brand = screen.getByText(/weestoater/i);
    expect(brand).toBeInTheDocument();
  });

  test("has weestoater icon with alt text", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const logo = screen.getByAltText(/weestoater/i);
    expect(logo).toBeInTheDocument();
  });
});

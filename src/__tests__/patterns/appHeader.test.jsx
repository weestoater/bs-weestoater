import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../../patterns/appheader";

describe("AppHeader pattern", () => {
  test("has weestoater branding", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const branding = screen.getByText(/weestoater/i);
    expect(branding).toBeInTheDocument();
  });

  test("has weestoater icon with alt text", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const altText = screen.getByAltText(/weestoater logo/i);
    expect(altText).toBeInTheDocument();
  });
});

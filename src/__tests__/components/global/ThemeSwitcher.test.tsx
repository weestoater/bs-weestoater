import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSwitcher } from "../../../components/global/ThemeSwitcher";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders with light theme by default", () => {
    render(<ThemeSwitcher />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).not.toBeChecked();
  });

  it("toggles theme when clicked", () => {
    render(<ThemeSwitcher />);
    const switchInput = screen.getByRole("switch");

    // Click to toggle to dark
    fireEvent.click(switchInput);
    expect(switchInput).toBeChecked();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("weestoater:theme")).toBe("dark");

    // Click to toggle back to light
    fireEvent.click(switchInput);
    expect(switchInput).not.toBeChecked();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("weestoater:theme")).toBe("light");
  });

  it("loads theme from localStorage", () => {
    localStorage.setItem("weestoater:theme", "dark");
    render(<ThemeSwitcher />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeChecked();
  });

  it("respects prefers-color-scheme when no localStorage value", () => {
    // Mock matchMedia for dark mode preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeSwitcher />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeChecked();
  });

  it("has proper accessibility attributes", () => {
    localStorage.setItem("weestoater:theme", "light");
    document.documentElement.setAttribute("data-theme", "light");

    render(<ThemeSwitcher />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toHaveAttribute("aria-label", "Switch to dark mode");
    expect(switchInput).toHaveAttribute("aria-checked");

    // Check for live region
    const liveRegion = document.querySelector(
      '[role="status"][aria-live="polite"]'
    );
    expect(liveRegion).toBeInTheDocument();
  });

  it("displays correct icon for theme", () => {
    // Set localStorage to light theme before render
    localStorage.setItem("weestoater:theme", "light");
    document.documentElement.setAttribute("data-theme", "light");

    const { container } = render(<ThemeSwitcher />);

    // Both icons should be present (sun for light, moon for dark)
    const sunIcon = container.querySelector("i.bi-sun-fill");
    const moonIcon = container.querySelector("i.bi-moon-stars-fill");
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();

    // Verify labels are present
    const labels = screen.getAllByText(/Light|Dark/i);
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });
});

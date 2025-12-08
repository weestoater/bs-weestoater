import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsModal } from "../../../components/global/SettingsModal";

// Mock the ThemeSwitcher component
vi.mock("../../../components/global/ThemeSwitcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}));

describe("SettingsModal", () => {
  const mockToggle = vi.fn();
  const mockOnThemeChange = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the modal when open", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Select font family")).toBeInTheDocument();
    expect(screen.getByLabelText("Select text size")).toBeInTheDocument();
    expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
  });

  it("displays all font options", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(screen.getByText("Default (System)")).toBeInTheDocument();
    expect(screen.getByText("Serif (Georgia)")).toBeInTheDocument();
    expect(screen.getByText("Sans-Serif (Ubuntu)")).toBeInTheDocument();
    expect(
      screen.getByText("Dyslexia Friendly (OpenDyslexic)")
    ).toBeInTheDocument();
  });

  it("displays all font size options", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(screen.getByText("Smaller")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Larger")).toBeInTheDocument();
    expect(screen.getByText("Huge")).toBeInTheDocument();
  });

  it("changes font when selected", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const fontSelect = screen.getByLabelText("Select font family");
    fireEvent.change(fontSelect, { target: { value: "dyslexic" } });

    expect(fontSelect).toHaveValue("dyslexic");
  });

  it("changes font size when selected", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const fontSizeSelect = screen.getByLabelText("Select text size");
    fireEvent.change(fontSizeSelect, { target: { value: "large" } });

    expect(fontSizeSelect).toHaveValue("large");
  });

  it("shows theme switcher component", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
  });

  it("resets to defaults when reset button is clicked", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const resetButton = screen.getByText("Reset to defaults");
    fireEvent.click(resetButton);

    expect(mockOnThemeChange).toHaveBeenCalledWith("light");
  });

  it("calls toggle when Done button is clicked", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const doneButton = screen.getByText("Done");
    fireEvent.click(doneButton);

    expect(mockToggle).toHaveBeenCalled();
  });

  it("displays info message about auto-save", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(
      screen.getByText(/Settings are saved automatically/i)
    ).toBeInTheDocument();
  });

  it("shows high contrast option", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    // High contrast checkbox should always be visible
    expect(
      screen.getByLabelText("Enable high contrast mode")
    ).toBeInTheDocument();
    expect(screen.getByText("High Contrast")).toBeInTheDocument();
  });
});

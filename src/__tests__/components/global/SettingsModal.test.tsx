import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsModal } from "../../../components/global/SettingsModal";

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
    expect(screen.getByText("Font")).toBeInTheDocument();
    expect(screen.getByText("Text Size")).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("displays all font options", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const buttons = screen.getAllByText("Default");
    expect(buttons.length).toBeGreaterThan(0);
    expect(screen.getByText("Calibri")).toBeInTheDocument();
    expect(screen.getByText("Ubuntu")).toBeInTheDocument();
    expect(screen.getByText("Dyslexic")).toBeInTheDocument();
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
    const defaultButtons = screen.getAllByText("Default");
    expect(defaultButtons.length).toBeGreaterThan(0);
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

    const dyslexicButton = screen.getByText("Dyslexic");
    fireEvent.click(dyslexicButton);

    expect(dyslexicButton).toHaveAttribute("aria-pressed", "true");
  });

  it("changes font size when selected", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    const largerButton = screen.getByText("Larger");
    fireEvent.click(largerButton);

    expect(largerButton).toHaveAttribute("aria-pressed", "true");
  });

  it("shows theme switcher component", () => {
    render(
      <SettingsModal
        isOpen={true}
        toggle={mockToggle}
        onThemeChange={mockOnThemeChange}
      />
    );

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("High Contrast")).toBeInTheDocument();
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

    // High contrast radio button should be visible
    expect(screen.getByLabelText(/High Contrast/i)).toBeInTheDocument();
  });
});

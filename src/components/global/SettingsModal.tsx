import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const SETTINGS_KEY = "weestoater:settings";

export interface UserSettings {
  font: "default" | "calibri" | "ubuntu" | "dyslexic";
  fontSize: "smaller" | "medium" | "large" | "huge";
  theme: "light" | "dark" | "high-contrast" | "gov-uk";
}

const defaultSettings: UserSettings = {
  font: "default",
  fontSize: "medium",
  theme: "light",
};

interface SettingsModalProps {
  isOpen: boolean;
  toggle: () => void;
  onThemeChange: (theme: "light" | "dark" | "high-contrast" | "gov-uk") => void;
}

export const SettingsModal = ({
  isOpen,
  toggle,
  onThemeChange,
}: SettingsModalProps) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;

    // Apply font
    const fontMap = {
      default: "'Jost', sans-serif",
      calibri: "Calibri, 'Segoe UI', sans-serif",
      ubuntu: "'Ubuntu', sans-serif",
      dyslexic: "OpenDyslexic, 'Comic Sans MS', sans-serif",
    };
    root.style.setProperty("--user-font", fontMap[settings.font]);

    // Apply font size (rem-based)
    const fontSizeMap = {
      smaller: "0.8rem",
      medium: "1rem",
      large: "1.2rem",
      huge: "1.5rem",
    };
    root.style.setProperty("--user-font-size", fontSizeMap[settings.fontSize]);

    // Apply theme
    if (settings.theme === "high-contrast") {
      root.setAttribute("data-theme", "dark");
      root.setAttribute("data-high-contrast", "true");
    } else {
      root.setAttribute("data-theme", settings.theme);
      root.removeAttribute("data-high-contrast");
    }

    // Save to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleFontChange = (font: UserSettings["font"]) => {
    setSettings((prev) => ({ ...prev, font }));
  };

  const handleFontSizeChange = (fontSize: UserSettings["fontSize"]) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const handleThemeChange = (theme: UserSettings["theme"]) => {
    setSettings((prev) => ({ ...prev, theme }));
    // Also notify parent component for backward compatibility
    onThemeChange(theme);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    onThemeChange(defaultSettings.theme);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <i className="bi bi-gear-fill me-2" aria-hidden="true"></i>
        Settings
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>
            <strong>Font</strong>
          </Label>
          <small className="text-muted d-block mb-2">
            Choose a font that's comfortable for reading
          </small>
          <div className="settings-button-grid">
            <Button
              color={
                settings.font === "default" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontChange("default")}
              className="settings-font-btn font-default"
              aria-pressed={settings.font === "default"}
            >
              Default
            </Button>
            <Button
              color={
                settings.font === "calibri" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontChange("calibri")}
              className="settings-font-btn font-calibri"
              aria-pressed={settings.font === "calibri"}
            >
              Calibri
            </Button>
            <Button
              color={
                settings.font === "ubuntu" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontChange("ubuntu")}
              className="settings-font-btn font-ubuntu"
              aria-pressed={settings.font === "ubuntu"}
            >
              Ubuntu
            </Button>
            <Button
              color={
                settings.font === "dyslexic" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontChange("dyslexic")}
              className="settings-font-btn font-dyslexic"
              aria-pressed={settings.font === "dyslexic"}
            >
              Dyslexic
            </Button>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>
            <strong>Text Size</strong>
          </Label>
          <small className="text-muted d-block mb-2">
            Adjust the base text size
          </small>
          <div className="settings-button-grid">
            <Button
              color={
                settings.fontSize === "smaller"
                  ? "success"
                  : "outline-secondary"
              }
              onClick={() => handleFontSizeChange("smaller")}
              className="settings-size-btn size-smaller"
              aria-pressed={settings.fontSize === "smaller"}
            >
              Smaller
            </Button>
            <Button
              color={
                settings.fontSize === "medium" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontSizeChange("medium")}
              className="settings-size-btn size-medium"
              aria-pressed={settings.fontSize === "medium"}
            >
              Default
            </Button>
            <Button
              color={
                settings.fontSize === "large" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontSizeChange("large")}
              className="settings-size-btn size-large"
              aria-pressed={settings.fontSize === "large"}
            >
              Larger
            </Button>
            <Button
              color={
                settings.fontSize === "huge" ? "success" : "outline-secondary"
              }
              onClick={() => handleFontSizeChange("huge")}
              className="settings-size-btn size-huge"
              aria-pressed={settings.fontSize === "huge"}
            >
              Huge
            </Button>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>
            <strong>Theme</strong>
          </Label>
          <small className="text-muted d-block mb-2">
            Choose your preferred colour theme
          </small>
          <div className="settings-theme-radio-grid">
            <FormGroup check className="mb-0">
              <Input
                type="radio"
                name="theme"
                id="themeLight"
                checked={settings.theme === "light"}
                onChange={() => handleThemeChange("light")}
              />
              <Label check for="themeLight">
                <i className="bi bi-sun-fill me-2" aria-hidden="true"></i>
                Light
              </Label>
            </FormGroup>
            <FormGroup check className="mb-0">
              <Input
                type="radio"
                name="theme"
                id="themeDark"
                checked={settings.theme === "dark"}
                onChange={() => handleThemeChange("dark")}
              />
              <Label check for="themeDark">
                <i
                  className="bi bi-moon-stars-fill me-2"
                  aria-hidden="true"
                ></i>
                Dark
              </Label>
            </FormGroup>
            <FormGroup check className="mb-0">
              <Input
                type="radio"
                name="theme"
                id="themeHighContrast"
                checked={settings.theme === "high-contrast"}
                onChange={() => handleThemeChange("high-contrast")}
              />
              <Label check for="themeHighContrast">
                <i className="bi bi-circle-half me-2" aria-hidden="true"></i>
                High Contrast
              </Label>
            </FormGroup>
            <FormGroup check className="mb-0">
              <Input
                type="radio"
                name="theme"
                id="themeGovUk"
                checked={settings.theme === "gov-uk"}
                onChange={() => handleThemeChange("gov-uk")}
              />
              <Label check for="themeGovUk">
                <i className="bi bi-bank me-2" aria-hidden="true"></i>
                GOV.UK
              </Label>
            </FormGroup>
          </div>
        </FormGroup>

        <div className="alert alert-info mt-3" role="status" aria-live="polite">
          <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
          Settings are saved automatically and will persist across visits
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleReset}>
          <i
            className="bi bi-arrow-counterclockwise me-2"
            aria-hidden="true"
          ></i>
          Reset to defaults
        </Button>
        <Button color="success" onClick={toggle}>
          <i className="bi bi-check-lg me-2" aria-hidden="true"></i>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

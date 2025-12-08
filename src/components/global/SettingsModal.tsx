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
import { ThemeSwitcher } from "./ThemeSwitcher";

const SETTINGS_KEY = "weestoater:settings";

export interface UserSettings {
  font: "default" | "serif" | "sans-serif" | "dyslexic";
  fontSize: "smaller" | "medium" | "large" | "huge";
  theme: "light" | "dark";
  highContrast: boolean;
}

const defaultSettings: UserSettings = {
  font: "default",
  fontSize: "medium",
  theme: "light",
  highContrast: false,
};

interface SettingsModalProps {
  isOpen: boolean;
  toggle: () => void;
  onThemeChange: (theme: "light" | "dark") => void;
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
      serif: "Georgia, 'Times New Roman', serif",
      "sans-serif": "'Ubuntu', sans-serif",
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

    // Apply high contrast mode
    if (settings.highContrast) {
      root.setAttribute("data-high-contrast", "true");
    } else {
      root.removeAttribute("data-high-contrast");
    }

    // Save to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, font: e.target.value as any }));
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, fontSize: e.target.value as any }));
  };

  const handleHighContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, highContrast: e.target.checked }));
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
          <Label for="fontSelect">
            <strong>Font</strong>
          </Label>
          <Input
            type="select"
            id="fontSelect"
            value={settings.font}
            onChange={handleFontChange}
            aria-label="Select font family"
          >
            <option value="default">Default (System)</option>
            <option value="serif">Serif (Georgia)</option>
            <option value="sans-serif">Sans-Serif (Ubuntu)</option>
            <option value="dyslexic">Dyslexia Friendly (OpenDyslexic)</option>
          </Input>
          <small className="text-muted">
            Choose a font that's comfortable for reading
          </small>
        </FormGroup>

        <FormGroup>
          <Label for="fontSizeSelect">
            <strong>Text Size</strong>
          </Label>
          <Input
            type="select"
            id="fontSizeSelect"
            value={settings.fontSize}
            onChange={handleFontSizeChange}
            aria-label="Select text size"
          >
            <option value="smaller">Smaller</option>
            <option value="medium">Default</option>
            <option value="large">Larger</option>
            <option value="huge">Huge</option>
          </Input>
          <small className="text-muted">Adjust the base text size</small>
        </FormGroup>

        <FormGroup>
          <Label>
            <strong>Theme</strong>
          </Label>
          <small className="text-muted d-block mb-2">
            Choose your preferred colour theme
          </small>
          <div className="d-flex gap-4 align-items-center">
            <div className="theme-switcher-container">
              <ThemeSwitcher />
            </div>
            <FormGroup check className="mb-0">
              <Input
                type="checkbox"
                id="highContrastCheck"
                checked={settings.highContrast}
                onChange={handleHighContrastChange}
                aria-label="Enable high contrast mode"
              />
              <Label check for="highContrastCheck" className="ms-2">
                <i className="bi bi-circle-half me-2" aria-hidden="true"></i>
                High Contrast
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
        <Button color="tertiary" onClick={handleReset}>
          <i
            className="bi bi-arrow-counterclockwise me-2"
            aria-hidden="true"
          ></i>
          Reset to defaults
        </Button>
        <Button color="primary" onClick={toggle}>
          <i className="bi bi-check-lg me-2" aria-hidden="true"></i>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

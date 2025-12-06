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
  font: "default" | "serif" | "sans-serif" | "monospace" | "dyslexic";
  fontSize: "small" | "medium" | "large" | "x-large";
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
      default: "system-ui, -apple-system, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      "sans-serif": "Arial, Helvetica, sans-serif",
      monospace: "'Courier New', Courier, monospace",
      dyslexic: "OpenDyslexic, 'Comic Sans MS', sans-serif",
    };
    root.style.setProperty("--user-font", fontMap[settings.font]);

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "x-large": "20px",
    };
    root.style.setProperty("--user-font-size", fontSizeMap[settings.fontSize]);

    // Apply high contrast mode
    if (settings.highContrast && settings.font === "dyslexic") {
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
            <strong>Font Family</strong>
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
            <option value="sans-serif">Sans-Serif (Arial)</option>
            <option value="monospace">Monospace (Courier)</option>
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
            <option value="small">Small (14px)</option>
            <option value="medium">Medium (16px)</option>
            <option value="large">Large (18px)</option>
            <option value="x-large">Extra Large (20px)</option>
          </Input>
          <small className="text-muted">Adjust the base text size</small>
        </FormGroup>

        <FormGroup>
          <Label>
            <strong>Theme</strong>
          </Label>
          <div className="theme-switcher-container">
            <ThemeSwitcher />
          </div>
          <small className="text-muted d-block mt-2">
            Choose your preferred color theme
          </small>
        </FormGroup>

        {settings.font === "dyslexic" && (
          <FormGroup
            check
            className="mt-3 p-3 border rounded dyslexia-option-box"
          >
            <Input
              type="checkbox"
              id="highContrastCheck"
              checked={settings.highContrast}
              onChange={handleHighContrastChange}
              aria-label="Enable high contrast dyslexia-friendly colors"
            />
            <Label check for="highContrastCheck" className="ms-2">
              <strong>Enable High Contrast Colors</strong>
              <small className="d-block text-muted mt-1">
                Blue and yellow color scheme optimized for dyslexia
              </small>
            </Label>
          </FormGroup>
        )}

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
          Reset to Defaults
        </Button>
        <Button color="primary" onClick={toggle}>
          <i className="bi bi-check-lg me-2" aria-hidden="true"></i>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

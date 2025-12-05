import { useEffect, useState, useRef } from "react";

const THEME_KEY = "weestoater:theme";
type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // Fallback to OS preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" ? getPreferredTheme() : "light"
  );
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    // Announce theme change to screen readers
    if (announcementRef.current) {
      announcementRef.current.textContent = `${
        theme === "dark" ? "Dark" : "Light"
      } mode activated`;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <div className="form-check form-switch theme-switcher">
        <label htmlFor="themeSwitch" className="theme-label">
          <i className="bi bi-sun-fill" aria-hidden="true"></i>
          <span className="label-text">Light</span>
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="themeSwitch"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-checked={theme === "dark"}
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <label htmlFor="themeSwitch" className="theme-label">
          <i className="bi bi-moon-stars-fill" aria-hidden="true"></i>
          <span className="label-text">Dark</span>
        </label>
      </div>
      {/* Live region for screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      />
    </>
  );
};

export default ThemeSwitcher;

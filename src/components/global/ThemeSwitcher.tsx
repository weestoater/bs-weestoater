import { useEffect, useState } from "react";

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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="form-check form-switch theme-switcher">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="themeSwitch"
        aria-label="Toggle dark mode"
        aria-checked={theme === "dark"}
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <label className="form-check-label" htmlFor="themeSwitch">
        <i
          className={`bi bi-${
            theme === "dark" ? "moon-stars-fill" : "sun-fill"
          }`}
        ></i>
        <span className="visually-hidden">
          {theme === "dark" ? "Dark" : "Light"} mode
        </span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;

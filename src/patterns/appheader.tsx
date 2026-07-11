import { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import { NavLink as RouterNavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import type { NavigationItem } from "../types/weecms";
import { getSupabaseClient } from "../../backend/index.js";

const { createNavigationService } = await import("../../backend/index.js");

// Type assertion to fix HashLink typing issue
const HashLinkSafe = HashLink as unknown as React.ComponentType<
  Record<string, unknown>
>;
import wsIcon from "../assets/img/weestoater-icon.png";
import { SettingsModal } from "../components/global/SettingsModal";
// import { SearchBar } from "../components/global/SearchBar"; // Hidden pending expansion

// Fallback navigation items (used if database is empty or error occurs)
const fallbackItems = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "A11y", path: "/a11y" },
  { label: "Agile", path: "/agile" },
  { label: "Books", path: "/books" },
  { label: "Football", path: "/football" },
  { label: "Landie", path: "/landie" },
  { label: "React", path: "/react" },
  { label: "SW", path: "/sw" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navItems, setNavItems] =
    useState<Array<{ label: string; path: string; icon?: string }>>(
      fallbackItems,
    );

  const toggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const loadNavigation = async () => {
    try {
      const client = getSupabaseClient();
      const navService = createNavigationService(client);
      const items = await navService.getNavigationItems({
        includeHidden: false,
      });

      if (items && items.length > 0) {
        // Map database items to our simplified format
        const mappedItems = items.map((item: NavigationItem) => ({
          label: item.label,
          path: item.path,
          icon: item.icon,
        }));
        setNavItems(mappedItems);
      } else {
        // Use fallback if database is empty
        console.log("Using fallback navigation - database is empty");
      }
    } catch (error) {
      console.error("Failed to load navigation, using fallback:", error);
      // Keep fallback items on error
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNavigation();
  }, []);

  const handleThemeChange = (
    newTheme: "light" | "dark" | "high-contrast" | "gov-uk",
  ) => {
    if (newTheme === "high-contrast") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.removeAttribute("data-high-contrast");
    }
    localStorage.setItem("weestoater:theme", newTheme);
  };

  return (
    <>
      <Navbar color="dark" dark expand="lg">
        <HashLinkSafe to="#content" className="skip-link">
          Skip to main content
        </HashLinkSafe>
        <NavbarBrand>
          <img src={wsIcon} alt="weestoater logo" className="header-app-logo" />
          <span>weestoater</span>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar aria-label="Main navigation">
            {navItems.map((item, key) => (
              <NavItem key={key}>
                <RouterNavLink
                  to={item.path}
                  end
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  {item.icon && <i className={`${item.icon} me-1`}></i>}
                  {item.label}
                </RouterNavLink>
              </NavItem>
            ))}
          </Nav>
          <div className="ms-auto d-flex align-items-center gap-2">
            {/* <SearchBar /> */}
            <Button
              color="link"
              className="settings-button"
              onClick={toggleSettings}
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <i
                className="bi bi-universal-access-circle"
                aria-hidden="true"
              ></i>
              <span className="settings-label">Settings</span>
            </Button>
          </div>
        </Collapse>
      </Navbar>
      <SettingsModal
        isOpen={settingsOpen}
        toggle={toggleSettings}
        onThemeChange={handleThemeChange}
      />
    </>
  );
};

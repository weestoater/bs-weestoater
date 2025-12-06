import { useState } from "react";
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

// Type assertion to fix HashLink typing issue
const HashLinkSafe = HashLink as React.ComponentType<any>;
import wsIcon from "../assets/img/weestoater-icon.png";
import { SettingsModal } from "../components/global/SettingsModal";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("weestoater:theme", newTheme);
  };

  const items = [
    "Home",
    "About",
    "A11y",
    "Agile",
    "Football",
    "Landie",
    "React",
    "SW",
  ];

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
            {items.map((item, key) => (
              <NavItem key={key}>
                <RouterNavLink
                  to={`/${item.toLowerCase()}`}
                  end
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  {item}
                </RouterNavLink>
              </NavItem>
            ))}
          </Nav>
          <div className="ms-auto d-flex align-items-center gap-2">
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

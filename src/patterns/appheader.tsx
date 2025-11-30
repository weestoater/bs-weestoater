import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink as RouterNavLink } from "react-router-dom";

import { HashLink } from "react-router-hash-link";

// Type assertion to fix HashLink typing issue
const HashLinkSafe = HashLink as React.ComponentType<any>;
import wsIcon from "../assets/img/weestoater-icon.png";
import { ThemeSwitcher } from "../components/global/ThemeSwitcher";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
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
          <Nav className="me-auto" navbar>
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
          <Nav navbar>
            <NavItem>
              <ThemeSwitcher />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

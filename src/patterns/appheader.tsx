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
import wsIcon from "../assets/img/weestoater-icon.png";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
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
      <Navbar color="dark" dark expand="md">
        <HashLink to="#content" className="skip-link">
          Skip to main content
        </HashLink>
        <NavbarBrand href="/">
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
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  {item}
                </RouterNavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

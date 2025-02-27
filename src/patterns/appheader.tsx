import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

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
  ];

  return (
    <>
      <HashLink to="#main-content" className="skip-link">
        Skip to main content
      </HashLink>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">
          <img src={wsIcon} alt="weestoater icon" className="header-app-logo" />{" "}
          weestoater
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            {items.map((item, key) => (
              <NavItem key={key}>
                <NavLink href={`./#/${item.toLowerCase()}`}>{item}</NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

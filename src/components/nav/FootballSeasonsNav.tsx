import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

export function FootballSeasonsNav() {
  return (
    <Nav
      className="nav-pills justify-content-center mb-4"
      role="navigation"
      aria-label="Football seasons"
    >
      <NavItem>
        <NavLink
          to="/football/season/2020-21"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          2020-21
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/football/season/2021-22"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          2021-22
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/football/season/2022-23"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          2022-23
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/football/season/2023-24"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          2023-24
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          to="/football/season/2024-25"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          2024-25
        </NavLink>
      </NavItem>
    </Nav>
  );
}

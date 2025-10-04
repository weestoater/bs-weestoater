import { NavLink } from "react-router-dom";

export const FootballSeasonsNav = () => {
  return (
    <ul className="seasons-nav">
      <li>
        <NavLink
          to="/football"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2025-26
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/2024-25-season"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2024-25
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/2023-24-season"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2023-24
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/2022-23-season"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2022-23
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/2021-22-season"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2021-22
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/2020-21-season"
          className={({ isActive }) => (isActive ? "active-class" : "")}
        >
          2020-21
        </NavLink>
      </li>
    </ul>
  );
};

import { NavLink } from "react-router-dom";

export function FootballSeasonsNav() {
  return (
    <nav className="seasons-nav">
      <ul>
        <li>
          <NavLink to="/football/season/2020-21">2020-21</NavLink>
        </li>
        <li>
          <NavLink to="/football/season/2021-22">2021-22</NavLink>
        </li>
        <li>
          <NavLink to="/football/season/2022-23">2022-23</NavLink>
        </li>
        <li>
          <NavLink to="/football/season/2023-24">2023-24</NavLink>
        </li>
        <li>
          <NavLink to="/football/season/2024-25">2024-25</NavLink>
        </li>
      </ul>
    </nav>
  );
}

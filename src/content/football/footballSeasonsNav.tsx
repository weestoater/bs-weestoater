import { NavLink } from "react-router-dom";
import { FOOTBALL_SEASONS } from "../../config/footballSeasons";

export const FootballSeasonsNav = () => {
  return (
    <ul className="seasons-nav">
      {FOOTBALL_SEASONS.map((season) => (
        <li key={season.id}>
          <NavLink
            to={season.isActive ? "/football" : `/season/${season.id}`}
            className={({ isActive }) => (isActive ? "active-class" : "")}
          >
            {season.displayName}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import { useState, useEffect } from "react";
import {
  getSupabaseClient,
  createDatabaseService,
} from "../../../backend/index.js";

interface Season {
  season_id: string;
  display_name: string;
  is_active: boolean;
}

export function FootballSeasonsNav() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const supabase = getSupabaseClient();
        const db = createDatabaseService(supabase);
        const seasonsData = await db.getFootballSeasons();
        setSeasons(seasonsData || []);
      } catch (error) {
        console.error("Failed to load seasons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, []);

  if (loading) {
    return (
      <Nav className="nav-pills justify-content-center mb-4">
        <NavItem>
          <span className="nav-link">Loading seasons...</span>
        </NavItem>
      </Nav>
    );
  }

  if (seasons.length === 0) {
    return null;
  }

  return (
    <Nav
      className="nav-pills justify-content-center mb-4"
      role="navigation"
      aria-label="Football seasons"
    >
      {seasons.map((season) => (
        <NavItem key={season.season_id}>
          <NavLink
            to={season.is_active ? "/football" : `/season/${season.season_id}`}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {season.display_name}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
}

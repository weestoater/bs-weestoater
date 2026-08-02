import { NavLink } from "react-router-dom";
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

export const FootballSeasonsNav = () => {
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
      <ul className="seasons-nav">
        <li>Loading seasons...</li>
      </ul>
    );
  }

  if (seasons.length === 0) {
    return null;
  }

  return (
    <ul className="seasons-nav">
      {seasons.map((season) => (
        <li key={season.season_id}>
          <NavLink
            to={season.is_active ? "/football" : `/season/${season.season_id}`}
            className={({ isActive }) => (isActive ? "active-class" : "")}
          >
            {season.display_name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

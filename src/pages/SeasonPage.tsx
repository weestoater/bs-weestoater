import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";
import { getSeasonById, isValidSeasonId } from "../config/footballSeasons";
import type {
  SeasonMatchData,
  SeasonGoalsData,
} from "../interfaces/footballTypes";

export const SeasonPage = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const [matches, setMatches] = useState<SeasonMatchData | null>(null);
  const [goals, setGoals] = useState<SeasonGoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate season ID
  const isValid = seasonId && isValidSeasonId(seasonId);
  const seasonConfig = isValid ? getSeasonById(seasonId) : null;
  const seasonDisplayName = seasonConfig?.fullName || seasonId || "";

  useEffect(() => {
    if (!isValid || !seasonId) return;

    const loadSeasonData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Dynamic imports
        const [matchesModule, goalsModule] = await Promise.all([
          import(`../data/${seasonId}-matches.json`),
          import(`../data/${seasonId}-goals.json`),
        ]);

        setMatches(matchesModule.default);
        setGoals(goalsModule.default);
      } catch (err) {
        console.error(`Failed to load data for season ${seasonId}:`, err);
        setError(`Unable to load data for ${seasonId} season`);
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
  }, [seasonId, isValid]);

  // Redirect if invalid season
  if (!isValid) {
    return <Navigate to="/football" replace />;
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" id="top">
      <PageTitleH1 title="Football Seasons" />

      <div className="row">
        <div className="previous-seasons">
          <FootballSeasonsNav />
        </div>
      </div>

      {matches && goals && (
        <FootballSeasonResults
          season={[seasonDisplayName]}
          matches={matches}
          goals={goals}
        />
      )}

      <div className="text-center my-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-up-circle me-2"></i>
          Back to Top
        </button>
      </div>
    </div>
  );
};

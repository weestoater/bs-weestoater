import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { Breadcrumb } from "../components/global/Breadcrumb";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";
import { getSeasonById, isValidSeasonId } from "../config/footballSeasons";
import { SkeletonCard } from "../components/global/SkeletonLoaders";
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
        <SkeletonCard />
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
      <Breadcrumb
        customItems={[
          { label: "Home", path: "/" },
          { label: "Football", path: "/football" },
          { label: seasonDisplayName, path: `/football/season/${seasonId}` },
        ]}
      />
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

      <BackToTop />
    </div>
  );
};

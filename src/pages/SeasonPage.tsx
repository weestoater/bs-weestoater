import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { FootballSeasonsNav } from "../content/football/footballSeasonsNav";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";
import { getSeasonById, isValidSeasonId } from "../config/footballSeasons";
import { SkeletonCard } from "../components/global/SkeletonLoaders";
import { getSupabaseClient } from "../../backend/index.js";
import { createDatabaseService } from "../../backend/supabase/database.js";
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
        const supabase = getSupabaseClient();
        const db = createDatabaseService(supabase);

        // Fetch complete season data from database
        const seasonData = await db.getFootballSeasonComplete(seasonId);

        if (!seasonData) {
          throw new Error(`Season ${seasonId} not found in database`);
        }

        // Transform matches to match expected format
        const matchesTransformed = seasonData.matches.map((match) => ({
          date: match.match_date,
          opposition: match.opposition,
          venue: match.venue,
          scored: match.goals_scored,
          conceded: match.goals_conceded,
          league: match.league,
          video: match.video_url,
          iplayer: match.iplayer_url,
          notes: match.notes,
          goals: match.goals.map((g) => ({
            player: g.player,
            mins: g.minute,
            assist: g.assist,
          })),
          cards: match.cards.map((c) => ({
            player: c.player,
            type: c.card_type,
            minute: c.minute,
          })),
        }));

        // Transform goal scorers to match expected format and sort alphabetically by player name
        const topScorers = seasonData.topScorers
          .map((scorer) => ({
            player: scorer.player,
            goals: scorer.goals,
            assists: scorer.assists,
          }))
          .sort((a, b) => a.player.localeCompare(b.player));

        setMatches({
          season: seasonId,
          matches: matchesTransformed,
        });

        setGoals({
          season: seasonId,
          topScorers,
        });
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
      <PageTitleH1
        title="Football Seasons"
        description="Detailed Motherwell FC season statistics, match results, and player performance data."
        keywords="Motherwell FC, season statistics, football matches, SPFL season data"
      />

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

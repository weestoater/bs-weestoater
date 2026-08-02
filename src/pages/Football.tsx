import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { FootballIntro } from "../content/football/footballIntro";
import { FootballSeasonResults } from "../components/football/footballSeasonResults";
import { SkeletonCard } from "../components/global/SkeletonLoaders";
import {
  getSupabaseClient,
  createDatabaseService,
} from "../../backend/index.js";
import { calculateTopScorers } from "../utils/footballUtils";
import { useDataFetch } from "../hooks/useDataFetch";
import type {
  SeasonMatchData,
  SeasonGoalsData,
} from "../interfaces/footballTypes";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FootballData {
  matchesData: SeasonMatchData;
  goalsData: SeasonGoalsData;
  currentSeasonId: string;
  currentSeasonDisplay: string;
}

export const FootballPage = () => {
  const { data, loading, error } = useDataFetch<FootballData>(
    async () => {
      const supabase = getSupabaseClient();
      const db = createDatabaseService(supabase);

      // Fetch the active season from the database
      const seasons = await db.getFootballSeasons({ includeInactive: false });
      if (!seasons || seasons.length === 0) {
        throw new Error(
          "No active season found. Please set a season as active in the admin panel.",
        );
      }

      const activeSeason = seasons[0];
      const CURRENT_SEASON = activeSeason.season_id;

      // Fetch complete season data
      const seasonData = await db.getFootballSeasonComplete(CURRENT_SEASON);

      if (!seasonData) {
        throw new Error(`Season ${CURRENT_SEASON} not found`);
      }

      // Transform matches to match expected format
      const matches = seasonData.matches.map((match) => ({
        date: match.match_date,
        opposition: match.opposition,
        venue: match.venue,
        scored: match.goals_scored ?? undefined,
        conceded: match.goals_conceded ?? undefined,
        league: match.league ?? undefined,
        video: match.video_url ?? undefined,
        iplayer: match.iplayer_url ?? undefined,
        notes: match.notes ?? undefined,
        goals: match.goals.map((g) => ({
          player: g.player,
          mins: g.minute,
          assist: g.assist ?? undefined,
        })),
        cards: match.cards.map((c) => ({
          player: c.player,
          type: c.card_type,
          minute: c.minute,
        })),
      }));

      // Calculate top scorers directly from match goals — single source of truth
      const topScorers = calculateTopScorers(matches);

      return {
        matchesData: {
          season: CURRENT_SEASON,
          matches,
        },
        goalsData: {
          season: CURRENT_SEASON,
          topScorers,
        },
        currentSeasonId: CURRENT_SEASON,
        currentSeasonDisplay: activeSeason.display_name,
      };
    },
    { cacheTTL: CACHE_TTL, cacheKey: `football-active-season` },
  );

  const matchesData = data?.matchesData || null;
  const goalsData = data?.goalsData || null;
  const currentSeasonDisplay = data?.currentSeasonDisplay || "";

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

  const seasons = currentSeasonDisplay ? [currentSeasonDisplay] : [];

  return (
    <div className="container-fluid" id="top">
      <PageTitleH1
        title="Motherwell FC Stats & Results"
        description="Comprehensive Motherwell FC match results, goal scorers, and season statistics. Track the Steelmen's performance with interactive data visualizations and detailed analytics."
        keywords="Motherwell FC, football statistics, Scottish football, Motherwell results, goal scorers, match data, SPFL"
      />
      <div className="row">
        <FootballIntro />
        {matchesData && goalsData && (
          <FootballSeasonResults
            season={seasons}
            matches={matchesData}
            goals={goalsData}
          />
        )}
      </div>

      <BackToTop />
    </div>
  );
};

import { useState, useEffect } from "react";
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
import type {
  SeasonMatchData,
  SeasonGoalsData,
} from "../interfaces/footballTypes";

const CURRENT_SEASON = "2025-26";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface FootballCache {
  matchesData: SeasonMatchData;
  goalsData: SeasonGoalsData;
  timestamp: number;
}

let footballCache: FootballCache | null = null;

export const FootballPage = () => {
  const [matchesData, setMatchesData] = useState<SeasonMatchData | null>(null);
  const [goalsData, setGoalsData] = useState<SeasonGoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeasonData = async () => {
      // Serve from cache if fresh
      if (footballCache && Date.now() - footballCache.timestamp < CACHE_TTL) {
        setMatchesData(footballCache.matchesData);
        setGoalsData(footballCache.goalsData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabaseClient();
        const db = createDatabaseService(supabase);

        // Fetch complete season data
        const seasonData = await db.getFootballSeasonComplete(CURRENT_SEASON);

        if (!seasonData) {
          throw new Error(`Season ${CURRENT_SEASON} not found`);
        }

        // Transform matches to match expected format
        const matches = seasonData.matches.map((match: any) => ({
          date: match.match_date,
          opposition: match.opposition,
          venue: match.venue,
          scored: match.goals_scored,
          conceded: match.goals_conceded,
          league: match.league,
          video: match.video_url,
          iplayer: match.iplayer_url,
          notes: match.notes,
          goals: match.goals.map((g: any) => ({
            player: g.player,
            mins: g.minute,
            assist: g.assist,
          })),
          cards: match.cards.map((c: any) => ({
            player: c.player,
            type: c.card_type,
            minute: c.minute,
          })),
        }));

        // Calculate top scorers directly from match goals — single source of truth
        const topScorers = calculateTopScorers(matches);

        const newMatchesData: SeasonMatchData = {
          season: CURRENT_SEASON,
          matches,
        };
        const newGoalsData: SeasonGoalsData = {
          season: CURRENT_SEASON,
          topScorers,
        };

        footballCache = {
          matchesData: newMatchesData,
          goalsData: newGoalsData,
          timestamp: Date.now(),
        };

        setMatchesData(newMatchesData);
        setGoalsData(newGoalsData);
      } catch (err) {
        console.error(`Failed to load football data:`, err);
        setError(`Unable to load football data for ${CURRENT_SEASON} season`);
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
  }, []);

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

  const seasons = ["2025-2026"];

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

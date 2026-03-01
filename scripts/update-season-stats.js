// Script to recalculate and upsert football_season_stats for a given season
// Usage: node scripts/update-season-stats.js <season_id>

import { createClient } from "@supabase/supabase-js";
import { createDatabaseService } from "../backend/supabase/database.js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const db = createDatabaseService(supabase);

async function updateSeasonStats(seasonId) {
  if (!seasonId) {
    console.error("Usage: node scripts/update-season-stats.js <season_id>");
    process.exit(1);
  }

  // Fetch all matches for the season (with goals)
  const season = await db.getFootballSeasonComplete(seasonId);
  if (!season || !season.matches) {
    console.error(`No matches found for season ${seasonId}`);
    process.exit(1);
  }

  // Aggregate goals and assists per player
  const statsMap = new Map();
  for (const match of season.matches) {
    if (!match.goals) continue;
    for (const goal of match.goals) {
      // Goals
      if (!statsMap.has(goal.player)) {
        statsMap.set(goal.player, { goals: 0, assists: 0 });
      }
      statsMap.get(goal.player).goals += 1;
      // Assists
      if (goal.assist) {
        if (!statsMap.has(goal.assist)) {
          statsMap.set(goal.assist, { goals: 0, assists: 0 });
        }
        statsMap.get(goal.assist).assists += 1;
      }
    }
  }

  // Upsert stats for each player
  for (const [player, { goals, assists }] of statsMap.entries()) {
    await db.upsertFootballSeasonStats({
      season_id: seasonId,
      player,
      goals,
      assists,
    });
    console.log(
      `Upserted stats for ${player}: ${goals} goals, ${assists} assists`,
    );
  }

  console.log("✅ Season stats updated!");
}

const seasonId = process.argv[2];
updateSeasonStats(seasonId).catch((err) => {
  console.error("Error updating season stats:", err);
  process.exit(1);
});

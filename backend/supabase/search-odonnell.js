/**
 * Search for all variations of O'Donnell in the database
 * Helps identify misspellings
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration in environment variables");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function searchODonnellVariations() {
  console.log(
    "🔍 Searching for all O'Donnell name variations in database...\n",
  );

  try {
    // Search in goals (player)
    const { data: goalsPlayers, error: e1 } = await supabase
      .from("football_match_goals")
      .select("player")
      .or(
        "player.ilike.%O'Donel%,player.ilike.%O'Donnel%,player.ilike.%O'Donnell%",
      );

    if (e1) throw e1;

    const uniqueGoalPlayers = [
      ...new Set(goalsPlayers?.map((g) => g.player) || []),
    ].sort();
    if (uniqueGoalPlayers.length > 0) {
      console.log("📍 Goal scorers with O'Donn* names:");
      uniqueGoalPlayers.forEach((name) => console.log(`   - "${name}"`));
      console.log();
    }

    // Search in goals (assists)
    const { data: assists, error: e2 } = await supabase
      .from("football_match_goals")
      .select("assist")
      .or(
        "assist.ilike.%O'Donel%,assist.ilike.%O'Donnel%,assist.ilike.%O'Donnell%",
      )
      .not("assist", "is", null);

    if (e2) throw e2;

    const uniqueAssists = [...new Set(assists?.map((a) => a.assist) || [])]
      .filter(Boolean)
      .sort();
    if (uniqueAssists.length > 0) {
      console.log("📍 Assist providers with O'Donn* names:");
      uniqueAssists.forEach((name) => console.log(`   - "${name}"`));
      console.log();
    }

    // Search in cards
    const { data: cards, error: e3 } = await supabase
      .from("football_match_cards")
      .select("player")
      .or(
        "player.ilike.%O'Donel%,player.ilike.%O'Donnel%,player.ilike.%O'Donnell%",
      );

    if (e3) throw e3;

    const uniqueCardPlayers = [
      ...new Set(cards?.map((c) => c.player) || []),
    ].sort();
    if (uniqueCardPlayers.length > 0) {
      console.log("📍 Card recipients with O'Donn* names:");
      uniqueCardPlayers.forEach((name) => console.log(`   - "${name}"`));
      console.log();
    }

    // Search in season stats
    const { data: stats, error: e4 } = await supabase
      .from("football_season_stats")
      .select("player, season_id")
      .or(
        "player.ilike.%O'Donel%,player.ilike.%O'Donnel%,player.ilike.%O'Donnell%",
      );

    if (e4) throw e4;

    if (stats && stats.length > 0) {
      console.log("📍 Season stats with O'Donn* names:");
      stats.forEach((s) => console.log(`   - "${s.player}" (${s.season_id})`));
      console.log();
    }

    // Get all unique variations
    const allNames = new Set([
      ...uniqueGoalPlayers,
      ...uniqueAssists,
      ...uniqueCardPlayers,
      ...(stats?.map((s) => s.player) || []),
    ]);

    console.log("\n📊 Summary:");
    console.log(`Total unique O'Donn* name variations found: ${allNames.size}`);
    if (allNames.size > 0) {
      console.log("\nAll variations:");
      [...allNames].sort().forEach((name) => {
        const correct = name === "Stephen O'Donnell";
        console.log(`   ${correct ? "✅" : "❌"} "${name}"`);
      });
    }
  } catch (error) {
    console.error("\n❌ Error searching database:", error);
    process.exit(1);
  }
}

// Run the search
searchODonnellVariations().then(() => {
  console.log("\n✨ Search complete!");
  process.exit(0);
});

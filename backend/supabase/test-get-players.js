/**
 * Test getFootballPlayers function for current season
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { createDatabaseService } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const db = createDatabaseService(supabase);

async function testGetPlayers() {
  console.log("🧪 Testing getFootballPlayers function...\n");

  // Get all seasons
  const seasons = await db.getFootballSeasons();
  console.log(`Found ${seasons.length} seasons:\n`);

  for (const season of seasons) {
    console.log(`\n📅 Season: ${season.display_name} (${season.season_id})`);
    console.log(`   Active: ${season.is_active ? "Yes" : "No"}`);

    const players = await db.getFootballPlayers(season.season_id);
    console.log(`   Players: ${players.length}`);

    // Check for O'Donnell variations
    const oDonnellPlayers = players.filter((p) => p.includes("O'Don"));
    if (oDonnellPlayers.length > 0) {
      console.log(`   O'Donnell variations found:`);
      oDonnellPlayers.forEach((p) => {
        const isCorrect = p === "Stephen O'Donnell";
        console.log(
          `      ${isCorrect ? "✅" : "❌"} "${p}" (${p.length} chars)`,
        );
      });
    }
  }

  // Test without season filter
  console.log("\n\n📋 All players (no season filter):");
  const allPlayers = await db.getFootballPlayers();
  const allODonnell = allPlayers.filter((p) => p.includes("O'Don"));
  if (allODonnell.length > 0) {
    console.log("O'Donnell variations:");
    allODonnell.forEach((p) => {
      const isCorrect = p === "Stephen O'Donnell";
      console.log(`   ${isCorrect ? "✅" : "❌"} "${p}" (${p.length} chars)`);
    });
  }

  console.log("\n✨ Test complete!");
}

testGetPlayers();

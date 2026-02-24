/**
 * Football Data Migration Script
 * Migrates football match and goals data from JSON files to Supabase database
 */

import { config } from "dotenv";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createSupabaseClient } from "./client.js";
import { createDatabaseService } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: join(__dirname, "..", ".env") });

// Service role key required to bypass RLS during migration
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

if (!SERVICE_ROLE_KEY) {
  console.error("\n❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is required");
  console.error(
    "This key bypasses Row Level Security for migration operations.\n",
  );
  console.error("Add to your .env file:");
  console.error("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n");
  console.error("Find it in: Supabase Dashboard → Project Settings → API\n");
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error("\n❌ ERROR: SUPABASE_URL is required");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createSupabaseClient({
  url: SUPABASE_URL,
  anonKey: SERVICE_ROLE_KEY, // Using service role key to bypass RLS
});

const db = createDatabaseService(supabase);

// Season configurations
const SEASONS = [
  {
    season_id: "2025-26",
    display_name: "2025-26",
    start_year: 2025,
    end_year: 2026,
    is_active: true,
  },
  {
    season_id: "2024-25",
    display_name: "2024-25",
    start_year: 2024,
    end_year: 2025,
    is_active: false,
  },
  {
    season_id: "2023-24",
    display_name: "2023-24",
    start_year: 2023,
    end_year: 2024,
    is_active: false,
  },
  {
    season_id: "2022-23",
    display_name: "2022-23",
    start_year: 2022,
    end_year: 2023,
    is_active: false,
  },
  {
    season_id: "2021-22",
    display_name: "2021-22",
    start_year: 2021,
    end_year: 2022,
    is_active: false,
  },
  {
    season_id: "2020-21",
    display_name: "2020-21",
    start_year: 2020,
    end_year: 2021,
    is_active: false,
  },
];

/**
 * Load JSON data from file
 */
function loadJSONFile(filePath) {
  try {
    const fullPath = join(__dirname, "..", "..", "src", "data", filePath);
    const fileContent = readFileSync(fullPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Migrate a single season's data
 */
async function migrateSeason(seasonId) {
  console.log(`\n📅 Migrating season: ${seasonId}`);

  // Load matches and goals data
  const matchesFile = `${seasonId}-matches.json`;
  const goalsFile = `${seasonId}-goals.json`;

  const matchesData = loadJSONFile(matchesFile);
  const goalsData = loadJSONFile(goalsFile);

  if (!matchesData || !matchesData.matches) {
    console.error(`  ❌ No matches data found for ${seasonId}`);
    return;
  }

  console.log(`  📊 Found ${matchesData.matches.length} matches`);

  // Prepare data for bulk insert
  const matches = [];
  const matchGoals = [];
  const matchCards = [];

  // Process each match
  for (const match of matchesData.matches) {
    // Create match record
    const matchRecord = {
      season_id: seasonId,
      match_date: match.date,
      opposition: match.opposition,
      venue: match.venue,
      goals_scored: match.scored !== undefined ? match.scored : null,
      goals_conceded: match.conceded !== undefined ? match.conceded : null,
      league: match.league || null,
      video_url: match.video || null,
      iplayer_url: match.iplayer || null,
      notes: match.notes || null,
    };

    matches.push(matchRecord);

    // We'll need to insert matches first to get IDs for goals/cards
  }

  try {
    // Insert matches
    console.log(`  💾 Inserting ${matches.length} matches...`);
    const insertedMatches = await db.bulkInsertFootballData({ matches });

    if (!insertedMatches.matches) {
      throw new Error("Failed to insert matches");
    }

    console.log(`  ✅ Inserted ${insertedMatches.matches.length} matches`);

    // Map original matches to inserted matches by date and opposition
    const matchMap = {};
    matchesData.matches.forEach((originalMatch, index) => {
      const key = `${originalMatch.date}-${originalMatch.opposition}`;
      matchMap[key] = insertedMatches.matches[index];
    });

    // Process goals and cards for each match
    for (const originalMatch of matchesData.matches) {
      const key = `${originalMatch.date}-${originalMatch.opposition}`;
      const insertedMatch = matchMap[key];

      if (!insertedMatch) {
        console.warn(`  ⚠️  Could not find inserted match for: ${key}`);
        continue;
      }

      // Process goals
      if (originalMatch.goals && Array.isArray(originalMatch.goals)) {
        for (const goal of originalMatch.goals) {
          matchGoals.push({
            match_id: insertedMatch.id,
            player: goal.player,
            minute: String(goal.mins || goal.minute || "0"), // Handle both 'mins' and 'minute'
            assist: goal.assist || null,
          });
        }
      }

      // Process cards
      if (originalMatch.cards && Array.isArray(originalMatch.cards)) {
        for (const card of originalMatch.cards) {
          matchCards.push({
            match_id: insertedMatch.id,
            player: card.player,
            card_type: card.type || card.card || "yellow", // Handle both 'type' and 'card'
            minute: parseInt(card.minute || card.mins || "0"), // Handle both 'minute' and 'mins'
          });
        }
      }
    }

    // Insert goals if any
    if (matchGoals.length > 0) {
      console.log(`  💾 Inserting ${matchGoals.length} goals...`);
      const insertedGoals = await db.bulkInsertFootballData({
        goals: matchGoals,
      });
      console.log(`  ✅ Inserted ${insertedGoals.goals?.length || 0} goals`);
    }

    // Insert cards if any
    if (matchCards.length > 0) {
      console.log(`  💾 Inserting ${matchCards.length} cards...`);
      const insertedCards = await db.bulkInsertFootballData({
        cards: matchCards,
      });
      console.log(`  ✅ Inserted ${insertedCards.cards?.length || 0} cards`);
    }

    // Process season stats (top scorers)
    if (
      goalsData &&
      goalsData.topScorers &&
      Array.isArray(goalsData.topScorers)
    ) {
      const stats = goalsData.topScorers.map((scorer) => ({
        season_id: seasonId,
        player: scorer.player,
        goals: scorer.goals || 0,
        assists: scorer.assists || 0,
      }));

      console.log(`  💾 Inserting ${stats.length} season stats...`);
      const insertedStats = await db.bulkInsertFootballData({ stats });
      console.log(
        `  ✅ Inserted ${insertedStats.stats?.length || 0} season stats`,
      );
    }

    console.log(`  ✅ Season ${seasonId} migration complete!`);
  } catch (error) {
    console.error(`  ❌ Error migrating season ${seasonId}:`, error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🏴󠁧󠁢󠁳󠁣󠁴󠁿 Football Data Migration Starting...\n");
  console.log("=".repeat(50));

  try {
    // Step 1: Insert seasons
    console.log("\n📅 Step 1: Creating seasons...");
    const insertedSeasons = await db.bulkInsertFootballData({
      seasons: SEASONS,
    });
    console.log(`✅ Created ${insertedSeasons.seasons?.length || 0} seasons\n`);

    // Step 2: Migrate each season's matches and goals
    console.log("📊 Step 2: Migrating match data...");
    for (const season of SEASONS) {
      await migrateSeason(season.season_id);
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n🎉 Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Seasons: ${SEASONS.length}`);
    console.log("   - Check your Supabase dashboard for complete details\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\nError details:", error);
    process.exit(1);
  }
}

// Run migration
migrate();

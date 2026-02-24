/**
 * Fix Stephen O'Donnell spelling in database
 * Updates all instances of "Stephen O'Donel" to "Stephen O'Donnell"
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
  console.error("Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixODonnellSpelling() {
  console.log(
    "🔍 Searching for misspelled instances of Stephen O'Donnell...\n",
  );

  try {
    // Check and update goals table (player who scored)
    const { data: goalsBefore, error: goalsCheckError } = await supabase
      .from("football_match_goals")
      .select("id, player")
      .ilike("player", "Stephen O'Donel");

    if (goalsCheckError) throw goalsCheckError;

    if (goalsBefore && goalsBefore.length > 0) {
      console.log(`Found ${goalsBefore.length} goals with misspelled name`);

      const { error: goalsUpdateError } = await supabase
        .from("football_match_goals")
        .update({ player: "Stephen O'Donnell" })
        .ilike("player", "Stephen O'Donel");

      if (goalsUpdateError) throw goalsUpdateError;
      console.log(`✅ Updated ${goalsBefore.length} goal records`);
    } else {
      console.log("✓ No misspelled goals found");
    }

    // Check and update goals table (player who assisted)
    const { data: assistsBefore, error: assistsCheckError } = await supabase
      .from("football_match_goals")
      .select("id, assist")
      .ilike("assist", "Stephen O'Donel");

    if (assistsCheckError) throw assistsCheckError;

    if (assistsBefore && assistsBefore.length > 0) {
      console.log(`Found ${assistsBefore.length} assists with misspelled name`);

      const { error: assistsUpdateError } = await supabase
        .from("football_match_goals")
        .update({ assist: "Stephen O'Donnell" })
        .ilike("assist", "Stephen O'Donel");

      if (assistsUpdateError) throw assistsUpdateError;
      console.log(`✅ Updated ${assistsBefore.length} assist records`);
    } else {
      console.log("✓ No misspelled assists found");
    }

    // Check and update cards table
    const { data: cardsBefore, error: cardsCheckError } = await supabase
      .from("football_match_cards")
      .select("id, player")
      .ilike("player", "Stephen O'Donel");

    if (cardsCheckError) throw cardsCheckError;

    if (cardsBefore && cardsBefore.length > 0) {
      console.log(`Found ${cardsBefore.length} cards with misspelled name`);

      const { error: cardsUpdateError } = await supabase
        .from("football_match_cards")
        .update({ player: "Stephen O'Donnell" })
        .ilike("player", "Stephen O'Donel");

      if (cardsUpdateError) throw cardsUpdateError;
      console.log(`✅ Updated ${cardsBefore.length} card records`);
    } else {
      console.log("✓ No misspelled cards found");
    }

    // Check and update season stats table
    const { data: statsBefore, error: statsCheckError } = await supabase
      .from("football_season_stats")
      .select("id, player, season_id")
      .ilike("player", "Stephen O'Donel");

    if (statsCheckError) throw statsCheckError;

    if (statsBefore && statsBefore.length > 0) {
      console.log(
        `Found ${statsBefore.length} season stats with misspelled name`,
      );

      const { error: statsUpdateError } = await supabase
        .from("football_season_stats")
        .update({ player: "Stephen O'Donnell" })
        .ilike("player", "Stephen O'Donel");

      if (statsUpdateError) throw statsUpdateError;
      console.log(`✅ Updated ${statsBefore.length} season stats records`);
    } else {
      console.log("✓ No misspelled season stats found");
    }

    console.log("\n✅ All records have been corrected!");
    console.log('Player name consistently updated to: "Stephen O\'Donnell"');
  } catch (error) {
    console.error("\n❌ Error fixing spelling:", error);
    process.exit(1);
  }
}

// Run the fix
fixODonnellSpelling().then(() => {
  console.log("\n✨ Done!");
  process.exit(0);
});

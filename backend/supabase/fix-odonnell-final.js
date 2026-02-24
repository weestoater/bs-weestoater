/**
 * Fix Stephen O'Donnel (one 'l') to Stephen O'Donnell (two 'l's)
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixODonnell() {
  console.log("🔧 Fixing Stephen O'Donnel → Stephen O'Donnell...\n");

  // Get the misspelled record(s)
  const { data: before, error: checkError } = await supabase
    .from("football_match_cards")
    .select("*")
    .eq("player", "Stephen O'Donnel");

  if (checkError) {
    console.error("Error checking:", checkError);
    process.exit(1);
  }

  if (!before || before.length === 0) {
    console.log("✅ No misspelled records found - already corrected!");
    process.exit(0);
  }

  console.log(`Found ${before.length} card(s) with misspelled name:\n`);
  before.forEach((card) => {
    console.log(`  Card ID: ${card.id}`);
    console.log(`  Player: "${card.player}" (length: ${card.player.length})`);
    console.log(`  Type: ${card.card_type}`);
    console.log(`  Minute: ${card.minute}`);
    console.log();
  });

  // Update all cards
  const { data: cardsUpdated, error: cardsError } = await supabase
    .from("football_match_cards")
    .update({ player: "Stephen O'Donnell" })
    .eq("player", "Stephen O'Donnel")
    .select();

  if (cardsError) {
    console.error("Error updating cards:", cardsError);
    process.exit(1);
  }

  console.log(`✅ Updated ${cardsUpdated.length} card record(s)`);

  // Check goals
  const { data: goalsUpdated, error: goalsError } = await supabase
    .from("football_match_goals")
    .update({ player: "Stephen O'Donnell" })
    .eq("player", "Stephen O'Donnel")
    .select();

  if (!goalsError && goalsUpdated.length > 0) {
    console.log(`✅ Updated ${goalsUpdated.length} goal record(s)`);
  }

  // Check assists
  const { data: assistsUpdated, error: assistsError } = await supabase
    .from("football_match_goals")
    .update({ assist: "Stephen O'Donnell" })
    .eq("assist", "Stephen O'Donnel")
    .select();

  if (!assistsError && assistsUpdated.length > 0) {
    console.log(`✅ Updated ${assistsUpdated.length} assist record(s)`);
  }

  // Check stats
  const { data: statsUpdated, error: statsError } = await supabase
    .from("football_season_stats")
    .update({ player: "Stephen O'Donnell" })
    .eq("player", "Stephen O'Donnel")
    .select();

  if (!statsError && statsUpdated.length > 0) {
    console.log(`✅ Updated ${statsUpdated.length} season stats record(s)`);
  }

  // Verify no more misspellings
  const { data: verify, error: verifyError } = await supabase
    .from("football_match_cards")
    .select("player")
    .eq("player", "Stephen O'Donnel");

  if (verifyError) {
    console.error("Error verifying:", verifyError);
    process.exit(1);
  }

  if (verify.length === 0) {
    console.log("\n✅ Verification passed: All records corrected!");
    console.log('Player name is now consistently: "Stephen O\'Donnell"\n');
  } else {
    console.log(
      `\n⚠️ Warning: Still found ${verify.length} misspelled record(s)`,
    );
  }

  console.log("✨ Done! Player list cache will refresh automatically.\n");
}

fixODonnell();

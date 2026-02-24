/**
 * Fix the one misspelled card for Stephen O'Donnell
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

async function fixODonnellCard() {
  console.log("🔧 Fixing Stephen O'Donnell spelling in cards table...\n");

  // Check first
  const { data: before, error: checkError } = await supabase
    .from("football_match_cards")
    .select("*")
    .eq("player", "Stephen O'Donel");

  if (checkError) {
    console.error("Error checking:", checkError);
    process.exit(1);
  }

  if (before && before.length > 0) {
    console.log(`Found ${before.length} card(s) with misspelled name:`);
    before.forEach((card) => {
      console.log(
        `  - Card ID: ${card.id}, Minute: ${card.minute}, Type: ${card.card_type}`,
      );
    });
    console.log();

    // Fix it
    const { data: updated, error: updateError } = await supabase
      .from("football_match_cards")
      .update({ player: "Stephen O'Donnell" })
      .eq("player", "Stephen O'Donel")
      .select();

    if (updateError) {
      console.error("Error updating:", updateError);
      process.exit(1);
    }

    console.log(`✅ Successfully updated ${updated.length} card record(s)`);
    console.log('Player name corrected to: "Stephen O\'Donnell"\n');

    // Verify
    const { data: after, error: verifyError } = await supabase
      .from("football_match_cards")
      .select("player")
      .eq("player", "Stephen O'Donel");

    if (verifyError) {
      console.error("Error verifying:", verifyError);
      process.exit(1);
    }

    if (after.length === 0) {
      console.log("✅ Verification passed: No more misspelled records found");
    } else {
      console.log("⚠️ Warning: Still found misspelled records after update");
    }
  } else {
    console.log("✓ No misspelled records found - already corrected!");
  }

  console.log("\n✨ Done!");
}

fixODonnellCard();

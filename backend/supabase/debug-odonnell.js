/**
 * Debug O'Donnell spellings - check character codes
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

async function debugODonnell() {
  console.log("🔍 Detailed analysis of O'Donnell name variations...\n");

  // Get all distinct player names from cards that contain O'Don
  const { data, error } = await supabase
    .from("football_match_cards")
    .select("player")
    .ilike("player", "%O%Don%");

  if (error) {
    console.error("Error:", error);
    process.exit(1);
  }

  const uniquePlayers = [...new Set(data.map((d) => d.player))].sort();

  console.log(
    `Found ${uniquePlayers.length} unique player names containing "O...Don":\n`,
  );

  uniquePlayers.forEach((name) => {
    console.log(`Player: "${name}"`);
    console.log(`Length: ${name.length}`);
    console.log(`Character codes:`);
    for (let i = 0; i < name.length; i++) {
      console.log(`  [${i}] '${name[i]}' = ${name.charCodeAt(i)}`);
    }
    console.log();
  });

  // Now update the one with single 'l'
  const singleL = uniquePlayers.find(
    (name) => name.includes("O'Donel") && !name.endsWith("ll"),
  );

  if (singleL) {
    console.log(`\n🔧 Found misspelling: "${singleL}"`);
    console.log(`Updating to: "Stephen O'Donnell"...\n`);

    const { data: updated, error: updateError } = await supabase
      .from("football_match_cards")
      .update({ player: "Stephen O'Donnell" })
      .eq("player", singleL)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
      process.exit(1);
    }

    console.log(`✅ Updated ${updated.length} record(s)`);
  } else {
    console.log("✅ All records already have correct spelling");
  }
}

debugODonnell();

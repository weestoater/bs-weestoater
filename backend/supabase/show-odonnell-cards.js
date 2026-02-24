/**
 * Show all O'Donnell cards to see the exact spelling
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

async function showODonnellCards() {
  const { data, error } = await supabase
    .from("football_match_cards")
    .select("*")
    .ilike("player", "%O'Donn%");

  if (error) {
    console.error("Error:", error);
    process.exit(1);
  }

  console.log("\n📋 All card records for players with O'Donn in name:\n");
  data.forEach((card) => {
    console.log(`ID: ${card.id}`);
    console.log(`Player: "${card.player}"`);
    console.log(`Type: ${card.card_type}`);
    console.log(`Minute: ${card.minute}`);
    console.log(`Match ID: ${card.match_id}`);
    console.log("---");
  });

  console.log(`\nTotal records: ${data.length}`);
}

showODonnellCards();

/**
 * Check for duplicate Stephen Walsh goals against Rangers
 */

import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDuplicates() {
  console.log("🔍 Searching for Stephen Walsh goals...\n");

  // Find all Stephen Walsh goals
  const { data: goals, error } = await supabase
    .from("football_match_goals")
    .select("id, match_id, player, minute, assist, created_at")
    .ilike("player", "%Stephen Walsh%")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }

  if (!goals || goals.length === 0) {
    console.log("No Stephen Walsh goals found.");
    return;
  }

  console.log(`Found ${goals.length} Stephen Walsh goal(s):\n`);

  // Get match details for each goal
  for (const goal of goals) {
    const { data: match } = await supabase
      .from("football_matches")
      .select("match_date, opposition, venue")
      .eq("id", goal.match_id)
      .single();

    console.log(`Goal ID: ${goal.id}`);
    console.log(
      `Match: ${match?.opposition} (${match?.venue}) - ${match?.match_date}`,
    );
    console.log(`Minute: ${goal.minute}`);
    console.log(`Assist: ${goal.assist || "None"}`);
    console.log(`Created: ${goal.created_at}`);
    console.log("---");
  }

  // Check for duplicates against Rangers
  const rangersGoals = goals.filter(
    (g) =>
      g.match_id && goals.filter((g2) => g2.match_id === g.match_id).length > 1,
  );

  if (rangersGoals.length > 0) {
    console.log("\n⚠️  DUPLICATES FOUND!");
    console.log(
      `\nFound ${rangersGoals.length} duplicate entries for the same match.`,
    );

    // Group by match_id
    const byMatch = {};
    for (const goal of goals) {
      if (!byMatch[goal.match_id]) {
        byMatch[goal.match_id] = [];
      }
      byMatch[goal.match_id].push(goal);
    }

    console.log("\nDuplicates by match:");
    for (const [matchId, matchGoals] of Object.entries(byMatch)) {
      if (matchGoals.length > 1) {
        const { data: match } = await supabase
          .from("football_matches")
          .select("opposition, match_date")
          .eq("id", matchId)
          .single();

        console.log(
          `\n${match?.opposition} (${match?.match_date}): ${matchGoals.length} entries`,
        );
        console.log("IDs to keep 1, delete others:");
        matchGoals.forEach((g, idx) => {
          console.log(
            `  ${idx === 0 ? "KEEP" : "DELETE"}: ${g.id} (created: ${g.created_at})`,
          );
        });
      }
    }
  }
}

checkDuplicates()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("💥 Error:", err);
    process.exit(1);
  });

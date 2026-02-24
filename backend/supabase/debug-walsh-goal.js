/**
 * Check for Walsh goals and Rangers matches with duplicate goals
 */

import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkIssue() {
  console.log("🔍 Step 1: Searching for Welsh goals...\n");

  const { data: walshGoals, error: walshError } = await supabase
    .from("football_match_goals")
    .select("*")
    .ilike("player", "%welsh%")
    .order("created_at", { ascending: true });

  if (walshError) {
    console.error("❌ Error:", walshError);
    process.exit(1);
  }

  console.log(`Found ${walshGoals?.length || 0} Welsh goal(s)\n`);

  if (walshGoals && walshGoals.length > 0) {
    for (const goal of walshGoals) {
      console.log(
        `Player: ${goal.player}, Minute: ${goal.minute}, Match ID: ${goal.match_id}`,
      );
    }
  }

  console.log("\n🔍 Step 2: Searching for Rangers matches...\n");

  const { data: rangersMatches, error: rangersError } = await supabase
    .from("football_matches")
    .select("id, match_date, opposition, venue")
    .ilike("opposition", "%rangers%")
    .order("match_date", { ascending: false });

  if (rangersError) {
    console.error("❌ Error:", rangersError);
    process.exit(1);
  }

  console.log(`Found ${rangersMatches?.length || 0} Rangers match(es)\n`);

  if (rangersMatches && rangersMatches.length > 0) {
    for (const match of rangersMatches) {
      console.log(
        `\nMatch: ${match.opposition} (${match.venue}) - ${match.match_date}`,
      );
      console.log(`Match ID: ${match.id}`);

      // Get goals for this match
      const { data: goals } = await supabase
        .from("football_match_goals")
        .select("*")
        .eq("match_id", match.id)
        .order("minute", { ascending: true });

      if (goals && goals.length > 0) {
        console.log(`Goals (${goals.length}):`);
        goals.forEach((g, idx) => {
          console.log(`  ${idx + 1}. ${g.player} (${g.minute}) - ID: ${g.id}`);
        });

        // Check for duplicates
        const playerGoals = {};
        for (const goal of goals) {
          const key = `${goal.player}-${goal.minute}`;
          if (!playerGoals[key]) {
            playerGoals[key] = [];
          }
          playerGoals[key].push(goal);
        }

        for (const [key, dupes] of Object.entries(playerGoals)) {
          if (dupes.length > 1) {
            console.log(
              `  ⚠️  DUPLICATE: ${dupes[0].player} at ${dupes[0].minute} appears ${dupes.length} times`,
            );
            console.log(`     IDs: ${dupes.map((d) => d.id).join(", ")}`);
          }
        }
      } else {
        console.log("  No goals recorded");
      }
    }
  }

  console.log(
    "\n🔍 Step 3: Checking for any duplicate goals using the detailed view...\n",
  );

  const { data: detailedMatches } = await supabase
    .from("football_matches_detailed")
    .select("*")
    .ilike("opposition", "%rangers%")
    .order("match_date", { ascending: false })
    .limit(5);

  if (detailedMatches && detailedMatches.length > 0) {
    for (const match of detailedMatches) {
      console.log(`\n${match.opposition} (${match.match_date})`);
      console.log(`Goals in view: ${JSON.stringify(match.goals, null, 2)}`);
    }
  }
}

checkIssue()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("💥 Error:", err);
    process.exit(1);
  });

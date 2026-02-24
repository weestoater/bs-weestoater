/**
 * Apply the fix for duplicate goals in football_matches_detailed view
 * This replaces the JOIN approach with subqueries to eliminate Cartesian products
 */

import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

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

async function applyFix() {
  console.log("🔧 Applying fix for duplicate goals/cards issue...\n");

  const sql = `
-- Drop and recreate the view with subqueries (no Cartesian product)
DROP VIEW IF EXISTS football_recent_matches CASCADE;
DROP VIEW IF EXISTS football_matches_detailed CASCADE;

CREATE VIEW football_matches_detailed
WITH (security_invoker = true) AS
SELECT 
  m.id,
  m.season_id,
  m.match_date,
  m.opposition,
  m.venue,
  m.goals_scored,
  m.goals_conceded,
  m.league,
  m.video_url,
  m.iplayer_url,
  m.notes,
  m.created_at,
  m.updated_at,
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', g.id,
      'player', g.player,
      'minute', g.minute,
      'assist', g.assist
    ) ORDER BY g.minute)
    FROM football_match_goals g
    WHERE g.match_id = m.id
  ), '[]'::json) as goals,
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', c.id,
      'player', c.player,
      'card_type', c.card_type,
      'minute', c.minute
    ) ORDER BY c.minute)
    FROM football_match_cards c
    WHERE c.match_id = m.id
  ), '[]'::json) as cards
FROM football_matches m;

CREATE VIEW football_recent_matches
WITH (security_invoker = true) AS
SELECT *
FROM football_matches_detailed
ORDER BY match_date DESC
LIMIT 10;
`;

  try {
    // Execute the SQL - we need to do this via RPC or direct query
    const { error } = await supabase.rpc("exec_sql", { query: sql });

    if (error) {
      // Try direct execution instead
      console.log("Attempting direct SQL execution...");

      // Split into individual statements and execute
      const statements = [
        "DROP VIEW IF EXISTS football_recent_matches CASCADE",
        "DROP VIEW IF EXISTS football_matches_detailed CASCADE",
        `CREATE VIEW football_matches_detailed
WITH (security_invoker = true) AS
SELECT 
  m.id,
  m.season_id,
  m.match_date,
  m.opposition,
  m.venue,
  m.goals_scored,
  m.goals_conceded,
  m.league,
  m.video_url,
  m.iplayer_url,
  m.notes,
  m.created_at,
  m.updated_at,
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', g.id,
      'player', g.player,
      'minute', g.minute,
      'assist', g.assist
    ) ORDER BY g.minute)
    FROM football_match_goals g
    WHERE g.match_id = m.id
  ), '[]'::json) as goals,
  COALESCE((
    SELECT json_agg(jsonb_build_object(
      'id', c.id,
      'player', c.player,
      'card_type', c.card_type,
      'minute', c.minute
    ) ORDER BY c.minute)
    FROM football_match_cards c
    WHERE c.match_id = m.id
  ), '[]'::json) as cards
FROM football_matches m`,
        `CREATE VIEW football_recent_matches
WITH (security_invoker = true) AS
SELECT *
FROM football_matches_detailed
ORDER BY match_date DESC
LIMIT 10`,
      ];

      for (const stmt of statements) {
        const { error: stmtError } = await supabase.rpc("exec", {
          query: stmt,
        });
        if (stmtError) {
          console.error(`Failed to execute: ${stmt.substring(0, 50)}...`);
          throw stmtError;
        }
      }
    }

    console.log("✅ Views recreated successfully!\n");

    // Verify the fix
    console.log("🔍 Verifying fix - checking Rangers match...\n");

    const { data: matches } = await supabase
      .from("football_matches_detailed")
      .select("*")
      .eq("opposition", "Rangers")
      .eq("match_date", "2026-02-11")
      .single();

    if (matches) {
      console.log(`Match: ${matches.opposition} (${matches.match_date})`);
      console.log(`Goals count: ${matches.goals.length}`);
      console.log(`Goals:`, JSON.stringify(matches.goals, null, 2));

      if (matches.goals.length === 1) {
        console.log(
          "\n✅ SUCCESS! Stephen Welsh goal now appears only ONCE!\n",
        );
      } else {
        console.log(
          "\n⚠️  Still seeing duplicates. May need manual SQL execution.\n",
        );
      }
    }
  } catch (error) {
    console.error("❌ Error applying fix:", error.message);
    console.error("\n📋 Please run this SQL manually in Supabase SQL Editor:");
    console.error("   See: backend/supabase/fix-goals-cards-order.sql\n");
    process.exit(1);
  }
}

applyFix()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("💥 Fatal error:", err);
    process.exit(1);
  });

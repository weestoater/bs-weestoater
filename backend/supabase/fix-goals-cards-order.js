/**
 * Fix Goals and Cards Display Order
 *
 * This script updates the football_matches_detailed view to ensure
 * goals and cards are ordered by minute (chronological order) instead
 * of appearing in random order.
 *
 * Changes:
 * - Adds ORDER BY g.minute to goals aggregation
 * - Adds ORDER BY c.minute to cards aggregation
 * - Removes DISTINCT which was preventing proper ordering
 *
 * Usage:
 *   node backend/supabase/fix-goals-cards-order.js
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("   - VITE_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log("🔄 Updating football_matches_detailed view...");
  console.log("   (This will order goals and cards by minute)");
  console.log("");

  try {
    // Read the SQL file
    const sqlFile = join(__dirname, "fix-goals-cards-order.sql");
    const sql = readFileSync(sqlFile, "utf8");

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, try direct execution
      console.log("   Attempting direct SQL execution...");
      const { error: directError } = await supabase
        .from("_sql")
        .insert({ query: sql });

      if (directError) {
        throw new Error(`SQL execution failed: ${directError.message}`);
      }
    }

    console.log("✅ View updated successfully!");
    console.log("");
    console.log(
      "Goals and cards will now display in chronological order (by minute).",
    );
    console.log("");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("");
    console.error("Please run the SQL manually in your Supabase SQL editor:");
    console.error("   backend/supabase/fix-goals-cards-order.sql");
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });

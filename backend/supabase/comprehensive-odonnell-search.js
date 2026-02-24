/**
 * Comprehensive search for ANY O'Donnel variations (including special characters)
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

async function comprehensiveODonnellSearch() {
  console.log(
    "🔍 COMPREHENSIVE O'Donnell search across ALL football tables...\n",
  );

  const tables = [
    { name: "football_match_goals", column: "player" },
    { name: "football_match_goals", column: "assist" },
    { name: "football_match_cards", column: "player" },
    { name: "football_season_stats", column: "player" },
  ];

  let totalVariations = new Set();

  for (const table of tables) {
    console.log(`\n📋 Checking ${table.name}.${table.column}...`);

    const { data, error } = await supabase
      .from(table.name)
      .select(`${table.column}, id`)
      .ilike(table.column, "%O'Don%");

    if (error) {
      console.error(`Error: ${error.message}`);
      continue;
    }

    if (data && data.length > 0) {
      const values = data.map((d) => d[table.column]).filter(Boolean);
      const uniqueValues = [...new Set(values)];

      uniqueValues.forEach((name) => {
        if (name && name.includes("O'Don")) {
          totalVariations.add(name);
          const isCorrect = name === "Stephen O'Donnell";
          const length = name.length;
          console.log(
            `  ${isCorrect ? "✅" : "❌"} "${name}" (length: ${length})`,
          );

          if (!isCorrect) {
            console.log(`     Character by character:`);
            for (let i = 0; i < name.length; i++) {
              console.log(
                `       [${i}] '${name[i]}' (code: ${name.charCodeAt(i)})`,
              );
            }
          }
        }
      });
    }
  }

  console.log("\n\n📊 SUMMARY:");
  console.log(
    `Total unique O'Don* variations found: ${totalVariations.size}\n`,
  );

  const variations = [...totalVariations].sort();
  variations.forEach((name) => {
    const isCorrect = name === "Stephen O'Donnell";
    console.log(`${isCorrect ? "✅" : "❌"} "${name}" (${name.length} chars)`);
  });

  const incorrect = variations.filter((name) => name !== "Stephen O'Donnell");
  if (incorrect.length > 0) {
    console.log(`\n⚠️  FOUND ${incorrect.length} INCORRECT SPELLING(S):`);
    incorrect.forEach((name) => console.log(`   "${name}"`));
  } else {
    console.log("\n✅ All spellings are correct!");
  }
}

comprehensiveODonnellSearch();

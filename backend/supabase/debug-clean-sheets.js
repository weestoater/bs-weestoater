// Debug script to check clean sheets data
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCleanSheets() {
  const { data, error } = await supabase
    .from("football_matches_detailed")
    .select("match_date, opposition, venue, goals_scored, goals_conceded")
    .eq("season_id", "2025-26")
    .order("match_date", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    return;
  }

  console.log(`\nTotal matches: ${data.length}`);
  console.log("\n=== ALL MATCHES ===");

  data.forEach((match) => {
    console.log(
      `${match.match_date} | ${match.opposition.padEnd(20)} | ${match.venue.padEnd(5)} | Scored: ${match.goals_scored} | Conceded: ${match.goals_conceded} | Type: ${typeof match.goals_conceded}`,
    );
  });

  // Count clean sheets
  const cleanSheets = data.filter((m) => m.goals_conceded === 0);
  console.log(`\n=== CLEAN SHEETS (conceded === 0) ===`);
  console.log(`Count: ${cleanSheets.length}`);
  cleanSheets.forEach((match) => {
    console.log(
      `${match.match_date} | ${match.opposition.padEnd(20)} | Conceded: ${match.goals_conceded}`,
    );
  });

  // Check for any that might be strings
  const stringZeros = data.filter((m) => m.goals_conceded === "0");
  console.log(`\n=== CLEAN SHEETS (conceded === "0" string) ===`);
  console.log(`Count: ${stringZeros.length}`);

  // Check data types
  console.log(`\n=== DATA TYPE CHECK ===`);
  if (data.length > 0) {
    console.log(`goals_conceded type: ${typeof data[0].goals_conceded}`);
    console.log(`goals_scored type: ${typeof data[0].goals_scored}`);
  }

  // Calculate all statistics like the component does
  console.log(`\n=== STATISTICS CALCULATION ===`);

  // Check venue values
  const uniqueVenues = [...new Set(data.map((m) => m.venue))];
  console.log(
    `Unique venue values in database: ${JSON.stringify(uniqueVenues)}`,
  );

  // Wins (scored > conceded)
  const wins = data.filter((m) => m.goals_scored > m.goals_conceded);
  console.log(
    `\nWins: ${wins.length} / ${data.length} = ${((wins.length / data.length) * 100).toFixed(1)}%`,
  );
  console.log("Win matches:");
  wins.forEach((m) => {
    console.log(
      `  ${m.match_date} | ${m.opposition.padEnd(20)} | ${m.venue.padEnd(5)} | ${m.goals_scored}-${m.goals_conceded}`,
    );
  });

  // Home wins
  const homeWins = data.filter(
    (m) => m.venue === "home" && m.goals_scored > m.goals_conceded,
  );
  const homeWinsCapital = data.filter(
    (m) => m.venue === "Home" && m.goals_scored > m.goals_conceded,
  );
  console.log(`\nHome Wins (lowercase 'home'): ${homeWins.length}`);
  console.log(`Home Wins (capitalized 'Home'): ${homeWinsCapital.length}`);
  homeWinsCapital.forEach((m) => {
    console.log(
      `  ${m.match_date} | ${m.opposition.padEnd(20)} | ${m.goals_scored}-${m.goals_conceded}`,
    );
  });

  // Away wins
  const awayWins = data.filter(
    (m) => m.venue === "away" && m.goals_scored > m.goals_conceded,
  );
  const awayWinsCapital = data.filter(
    (m) => m.venue === "Away" && m.goals_scored > m.goals_conceded,
  );
  console.log(`\nAway Wins (lowercase 'away'): ${awayWins.length}`);
  console.log(`Away Wins (capitalized 'Away'): ${awayWinsCapital.length}`);
  awayWinsCapital.forEach((m) => {
    console.log(
      `  ${m.match_date} | ${m.opposition.padEnd(20)} | ${m.goals_scored}-${m.goals_conceded}`,
    );
  });

  // Current clean sheet streak (from most recent backwards)
  let currentStreak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].goals_conceded === 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  console.log(`\nCurrent Clean Sheet Streak: ${currentStreak}`);
  console.log("Most recent matches (newest first):");
  for (let i = data.length - 1; i >= Math.max(0, data.length - 5); i--) {
    const m = data[i];
    console.log(
      `  ${m.match_date} | ${m.opposition.padEnd(20)} | Conceded: ${m.goals_conceded}`,
    );
  }

  // St. Mirren specific check
  const stMirrenMatches = data.filter((m) => m.opposition === "St. Mirren");
  console.log(`\n=== ST. MIRREN MATCHES DETAIL ===`);
  console.log(`Total: ${stMirrenMatches.length} matches`);
  stMirrenMatches.forEach((m) => {
    console.log(
      `  ${m.match_date} | ${m.venue.padEnd(5)} | Score: ${m.goals_scored}-${m.goals_conceded} | Clean sheet: ${m.goals_conceded === 0 ? "YES" : "NO"}`,
    );
  });
  const stMirrenCleanSheets = stMirrenMatches.filter(
    (m) => m.goals_conceded === 0,
  );
  console.log(
    `St. Mirren clean sheets: ${stMirrenCleanSheets.length} / ${stMirrenMatches.length}`,
  );
}

checkCleanSheets();

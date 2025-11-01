// Script to flatten JSON structure and convert dates to ISO format
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// Convert DD/MM/YY to YYYY-MM-DD
function convertDateToISO(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;

  let [day, month, year] = parts;

  // Convert 2-digit year to 4-digit
  if (year.length === 2) {
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    year = `${century + parseInt(year)}`;
  }

  // Pad day and month with leading zeros
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Process matches file
function processMatchesFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);

  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Check if it's already flattened
  if (!Array.isArray(content) || !content[0]?.details) {
    console.log("  Already flattened, skipping structure change");
    return;
  }

  const oldStructure = content[0];
  const matches = oldStructure.details || [];

  // Convert dates in matches
  matches.forEach((match) => {
    if (match.date) {
      match.date = convertDateToISO(match.date);
    }
  });

  // New flattened structure
  const newStructure = {
    season: oldStructure.season,
    matches: matches,
  };

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(newStructure, null, 2));
  console.log(`  ✅ Flattened and converted ${matches.length} matches`);
}

// Process goals file
function processGoalsFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);

  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Check if it's already flattened
  if (!Array.isArray(content) || !content[0]?.details) {
    console.log("  Already flattened, skipping");
    return;
  }

  const oldStructure = content[0];

  // New flattened structure
  const newStructure = {
    season: oldStructure.season,
    topScorers: oldStructure.details || [],
  };

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(newStructure, null, 2));
  console.log(`  ✅ Flattened ${newStructure.topScorers.length} scorers`);
}

// Main execution
console.log("🚀 Starting JSON structure improvements...\n");

const seasons = [
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
];

seasons.forEach((season) => {
  console.log(`\n📅 Season: ${season}`);

  const matchesFile = path.join(DATA_DIR, `${season}-matches.json`);
  const goalsFile = path.join(DATA_DIR, `${season}-goals.json`);

  try {
    if (fs.existsSync(matchesFile)) {
      processMatchesFile(matchesFile);
    } else {
      console.log(`  ⚠️  Matches file not found`);
    }

    if (fs.existsSync(goalsFile)) {
      processGoalsFile(goalsFile);
    } else {
      console.log(`  ⚠️  Goals file not found`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${season}:`, error.message);
  }
});

console.log("\n✅ JSON structure improvements complete!");
console.log("\n📝 Next steps:");
console.log(
  "1. Update components to use new structure (matches instead of [0].details)"
);
console.log("2. Update TypeScript interfaces");
console.log("3. Test all season pages");

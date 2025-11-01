// Script to fix data type issues in JSON files
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

const seasons = [
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
];

console.log("🔧 Fixing data type issues...\n");

let totalFixes = 0;

seasons.forEach((season) => {
  const matchesFile = path.join(DATA_DIR, `${season}-matches.json`);

  if (!fs.existsSync(matchesFile)) {
    return;
  }

  const data = JSON.parse(fs.readFileSync(matchesFile, "utf8"));

  if (!data.matches) {
    return;
  }

  let fixes = 0;

  data.matches.forEach((match) => {
    // Fix scored/conceded string to number
    if (typeof match.scored === "string") {
      match.scored = parseInt(match.scored, 10);
      fixes++;
    }
    if (typeof match.conceded === "string") {
      match.conceded = parseInt(match.conceded, 10);
      fixes++;
    }

    // Fix cards - convert MatchCard to proper format
    if (match.cards && Array.isArray(match.cards)) {
      match.cards = match.cards.map((card) => {
        // If it has 'card' field, it's in CardType format - convert to MatchCard
        if (card.card) {
          fixes++;
          return {
            player: card.player,
            type: card.card,
            minute:
              typeof card.mins === "string"
                ? parseInt(card.mins, 10) || 0
                : card.mins,
          };
        }
        // Already in correct format or fix minute
        if (typeof card.minute === "string") {
          card.minute = parseInt(card.minute, 10) || 0;
          fixes++;
        }
        return card;
      });
    }
  });

  if (fixes > 0) {
    fs.writeFileSync(matchesFile, JSON.stringify(data, null, 2));
    console.log(`✅ ${season}: Fixed ${fixes} data type issues`);
    totalFixes += fixes;
  } else {
    console.log(`✓  ${season}: No type issues found`);
  }
});

console.log(`\n✅ Total fixes: ${totalFixes}`);

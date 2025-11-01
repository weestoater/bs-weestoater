// Script to add missing 'assists' field to all goal scorers
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

console.log("🔧 Adding missing assists field to goal scorers...\n");

seasons.forEach((season) => {
  const goalsFile = path.join(DATA_DIR, `${season}-goals.json`);

  if (!fs.existsSync(goalsFile)) {
    console.log(`⚠️  ${season}-goals.json not found`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(goalsFile, "utf8"));

  if (!data.topScorers) {
    console.log(`⚠️  ${season}-goals.json missing topScorers`);
    return;
  }

  let updated = false;
  data.topScorers.forEach((scorer) => {
    if (scorer.assists === undefined) {
      scorer.assists = 0;
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(goalsFile, JSON.stringify(data, null, 2));
    console.log(
      `✅ ${season}: Added assists field to ${data.topScorers.length} scorers`
    );
  } else {
    console.log(`✓  ${season}: Already has assists field`);
  }
});

console.log("\n✅ All goal files updated!");

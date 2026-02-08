import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import daily step counts from Garmin Connect export or manual data
 * Usage: node scripts/daily-steps-importer.js [csv-file-path]
 *
 * This script processes daily step data from various Garmin export formats.
 */

function parseDate(dateString) {
  // Handle various date formats
  // YYYY-MM-DD, MM/DD/YYYY, etc.
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Return YYYY-MM-DD
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(value.toString().replace(/[,"]/g, "")) || 0;
}

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function parseCSV(csvContent) {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());

  const dailySteps = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length < 2) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || "";
    });

    // Try to find date and steps columns
    // Common headers: "Date", "Calendar Date", "Steps", "Total Steps", etc.
    const dateValue =
      row["Date"] || row["Calendar Date"] || row["date"] || values[0];
    const stepsValue =
      row["Steps"] ||
      row["Total Steps"] ||
      row["steps"] ||
      row["total_steps"] ||
      values[1];

    if (!dateValue || !stepsValue) continue;

    const date = parseDate(dateValue);
    const steps = parseNumber(stepsValue);

    if (steps <= 0) continue;

    // Create daily steps entry
    const dailyEntry = {
      date: date,
      steps: steps,
    };

    // Try to find optional fields
    const goal = parseNumber(
      row["Goal"] || row["Step Goal"] || row["goal"] || 0,
    );
    const distance = parseNumber(
      row["Distance"] || row["Total Distance"] || row["distance"] || 0,
    );
    const calories = parseNumber(
      row["Calories"] ||
        row["Active Calories"] ||
        row["calories"] ||
        row["active_calories"] ||
        0,
    );
    const floors = parseNumber(
      row["Floors"] ||
        row["Floors Climbed"] ||
        row["floors"] ||
        row["floors_climbed"] ||
        0,
    );

    if (goal > 0) dailyEntry.goal = goal;
    if (distance > 0) dailyEntry.distance = parseFloat(distance.toFixed(2));
    if (calories > 0) dailyEntry.calories = Math.round(calories);
    if (floors > 0) dailyEntry.floors = Math.round(floors);

    dailySteps.push(dailyEntry);
  }

  return dailySteps;
}

function importDailySteps(csvFile, outputFile) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvFile, "utf8");

    // Parse CSV to daily steps
    const dailySteps = parseCSV(csvContent);

    // Sort by date (newest first)
    dailySteps.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Determine output file
    const output =
      outputFile ||
      path.join(path.dirname(path.dirname(csvFile)), "data", "dailySteps.json");

    // Write to JSON file
    fs.writeFileSync(output, JSON.stringify(dailySteps, null, 2));

    console.log(`✓ Imported ${dailySteps.length} days of step data`);
    console.log(`  Output: ${output}`);

    if (dailySteps.length > 0) {
      const totalSteps = dailySteps.reduce((sum, d) => sum + d.steps, 0);
      const avgSteps = Math.round(totalSteps / dailySteps.length);

      console.log("\nSummary:");
      console.log(`  Total Steps: ${totalSteps.toLocaleString()}`);
      console.log(`  Average: ${avgSteps.toLocaleString()} steps/day`);
      console.log(
        `  Date Range: ${dailySteps[dailySteps.length - 1].date} to ${dailySteps[0].date}`,
      );

      // Show last 7 days
      console.log("\nLast 7 days:");
      dailySteps.slice(0, 7).forEach((day) => {
        console.log(
          `  ${day.date}: ${day.steps.toLocaleString()} steps${day.goal ? ` (goal: ${day.goal.toLocaleString()})` : ""}`,
        );
      });
    }
  } catch (error) {
    console.error("Error importing daily steps:", error.message);
    process.exit(1);
  }
}

// Manual data entry function
function createManualEntry() {
  console.log("Manual Daily Steps Entry");
  console.log("========================");
  console.log("");
  console.log("Create a CSV file with these columns:");
  console.log("Date,Steps,Goal,Distance,Calories,Floors");
  console.log("");
  console.log("Example:");
  console.log("2026-02-08,10245,10000,5.2,450,12");
  console.log("2026-02-07,8934,10000,4.5,380,8");
  console.log("");
  console.log("Then run:");
  console.log("node scripts/daily-steps-importer.js path/to/your-steps.csv");
}

// CLI usage
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.log("Import daily step counts from Garmin Connect export");
    console.log("");
    console.log("Usage: node daily-steps-importer.js <csv-file> [output-file]");
    console.log("");
    console.log("Arguments:");
    console.log("  csv-file     Path to daily steps CSV export");
    console.log(
      "  output-file  Output JSON path (default: src/data/dailySteps.json)",
    );
    console.log("");
    console.log("Export from Garmin Connect:");
    console.log("  1. Go to connect.garmin.com");
    console.log("  2. Reports → Health Stats");
    console.log("  3. Select date range");
    console.log("  4. Export as CSV");
    console.log("");
    console.log("Or create a manual CSV with format:");
    console.log("  Date,Steps,Goal,Distance,Calories,Floors");
    console.log("");
    console.log("Examples:");
    console.log("  node scripts/daily-steps-importer.js steps-export.csv");
    console.log(
      "  node scripts/daily-steps-importer.js data.csv src/data/dailySteps.json",
    );
    console.log("");
    process.exit(0);
  }

  const csvFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(csvFile)) {
    console.error(`Error: File not found: ${csvFile}`);
    console.error("");
    createManualEntry();
    process.exit(1);
  }

  importDailySteps(csvFile, outputFile);
}

export default importDailySteps;

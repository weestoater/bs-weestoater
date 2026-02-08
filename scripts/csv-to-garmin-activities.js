import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert Garmin Activities CSV export to JSON format
 * Usage: node scripts/csv-to-garmin-activities.js [csv-file-path] [output-path]
 *
 * This script converts Garmin Connect CSV exports to the GarminActivity format used by the app.
 */

function mapActivityType(activityType) {
  const typeMap = {
    running: "running",
    cycling: "cycling",
    walking: "walking",
    swimming: "swimming",
    hiking: "walking",
    biking: "cycling",
  };

  const typeLower = (activityType || "").toLowerCase();
  return typeMap[typeLower] || "other";
}

function parseTime(timeString) {
  // Parse HH:MM:SS format to seconds
  if (!timeString) return 0;
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function parsePace(paceString) {
  // Parse MM:SS format to decimal minutes per km
  if (!paceString) return null;
  const parts = paceString.split(":");
  const minutes = parseInt(parts[0]) || 0;
  const seconds = parseInt(parts[1]) || 0;
  return parseFloat((minutes + seconds / 60).toFixed(2));
}

function parseNumber(value) {
  // Remove commas and quotes from numbers like "2,452" or quotes
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(value.toString().replace(/[,"]/g, "")) || 0;
}

function parseDate(dateString) {
  // Convert "2026-02-08 09:24:09" to ISO format
  const date = new Date(dateString.replace(" ", "T") + "Z");
  return date.toISOString();
}

function generateId(date, type, distance) {
  // Generate unique ID based on activity data
  const hash = crypto.createHash("md5");
  hash.update(`${date}-${type}-${distance}`);
  return hash.digest("hex").substring(0, 16);
}

function parseCSV(csvContent) {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",");

  const activities = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || "";
    });

    // Map to our activity format
    const date = parseDate(row["Date"]);
    const type = mapActivityType(row["Activity Type"]);
    const distance = parseNumber(row["Distance"]);
    const duration = parseTime(row["Time"]);
    const calories = parseNumber(row["Calories"]);
    const avgHR = parseNumber(row["Avg HR"]);
    const maxHR = parseNumber(row["Max HR"]);
    const avgPace = parsePace(row["Avg Pace"]);
    const elevation = parseNumber(row["Total Ascent"]);

    const activity = {
      id: generateId(date, type, distance),
      date: date,
      type: type,
      distance: parseFloat(distance.toFixed(2)),
      duration: duration,
    };

    // Add optional fields only if they exist
    if (calories > 0) activity.calories = Math.round(calories);
    if (avgHR > 0) activity.averageHeartRate = Math.round(avgHR);
    if (maxHR > 0) activity.maxHeartRate = Math.round(maxHR);
    if (avgPace > 0) activity.averagePace = avgPace;
    if (elevation > 0) activity.elevation = Math.round(elevation);

    activities.push(activity);
  }

  return activities;
}

function parseCSVLine(line) {
  // Handle CSV parsing with quoted values
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

function convertCSVToActivities(csvFile, outputFile) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvFile, "utf8");

    // Parse CSV to activities
    const activities = parseCSV(csvContent);

    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Determine output file
    const output =
      outputFile ||
      path.join(
        path.dirname(path.dirname(csvFile)),
        "data",
        "garminActivities.json",
      );

    // Write to JSON file
    fs.writeFileSync(output, JSON.stringify(activities, null, 2));

    console.log(`✓ Converted ${activities.length} activities from CSV`);
    console.log(`  Output: ${output}`);
    console.log("\nActivity Summary:");

    // Show summary by type
    const typeCounts = {};
    activities.forEach((activity) => {
      typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
    });

    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} activities`);
    });

    console.log("\nMost recent activity:");
    const latest = activities[0];
    console.log(`  Date: ${new Date(latest.date).toLocaleString()}`);
    console.log(`  Type: ${latest.type}`);
    console.log(`  Distance: ${latest.distance} miles`);
    console.log(
      `  Duration: ${Math.floor(latest.duration / 60)}m ${latest.duration % 60}s`,
    );
  } catch (error) {
    console.error("Error converting CSV:", error.message);
    process.exit(1);
  }
}

// CLI usage
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("Convert Garmin Activities CSV export to JSON format");
    console.log("");
    console.log(
      "Usage: node csv-to-garmin-activities.js [csv-file] [output-file]",
    );
    console.log("");
    console.log("Arguments:");
    console.log(
      "  csv-file     Path to Activities.csv (default: src/garmin/Activities.csv)",
    );
    console.log(
      "  output-file  Output JSON path (default: src/data/garminActivities.json)",
    );
    console.log("");
    console.log("Examples:");
    console.log("  node scripts/csv-to-garmin-activities.js");
    console.log(
      "  node scripts/csv-to-garmin-activities.js src/garmin/Activities.csv",
    );
    console.log(
      "  node scripts/csv-to-garmin-activities.js Activities.csv my-activities.json",
    );
    console.log("");
    process.exit(0);
  }

  // Default paths
  const defaultCSVPath = path.join(
    path.dirname(__dirname),
    "src",
    "garmin",
    "Activities.csv",
  );
  const csvFile = args[0] || defaultCSVPath;
  const outputFile = args[1];

  if (!fs.existsSync(csvFile)) {
    console.error(`Error: File not found: ${csvFile}`);
    console.error("");
    console.error("Please export your activities from Garmin Connect:");
    console.error("1. Go to Garmin Connect (connect.garmin.com)");
    console.error("2. Navigate to Activities");
    console.error("3. Select activities and export as CSV");
    console.error("4. Save as src/garmin/Activities.csv");
    console.error("");
    process.exit(1);
  }

  convertCSVToActivities(csvFile, outputFile);
}

export default convertCSVToActivities;

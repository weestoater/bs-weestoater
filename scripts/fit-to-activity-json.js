import FitParser from "fit-file-parser";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert Garmin FIT files to simplified activity JSON format
 * Usage: node scripts/fit-to-activity-json.js <fit-file-path> [output-path]
 *
 * This script converts FIT files to the GarminActivity format used by the app.
 */

function mapSportType(sport) {
  const sportMap = {
    running: "running",
    cycling: "cycling",
    walking: "walking",
    swimming: "swimming",
    hiking: "walking",
    biking: "cycling",
  };

  const sportLower = (sport || "").toLowerCase();
  return sportMap[sportLower] || "other";
}

function convertFitToActivity(inputFile, outputFile) {
  const fitParser = new FitParser({
    force: true,
    speedUnit: "km/h",
    lengthUnit: "km",
    temperatureUnit: "celsius",
    elapsedRecordField: true,
    mode: "both",
  });

  const content = fs.readFileSync(inputFile);

  fitParser.parse(content, (error, data) => {
    if (error) {
      console.error("Error parsing FIT file:", error);
      process.exit(1);
    }

    // Extract session data (summary info)
    const session = data.sessions && data.sessions[0];

    if (!session) {
      console.error("No session data found in FIT file");
      process.exit(1);
    }

    // Calculate average pace (min/km) from speed
    let averagePace = null;
    if (session.avg_speed && session.avg_speed > 0) {
      averagePace = 60 / session.avg_speed; // Convert km/h to min/km
    }

    // Create activity object in our format
    const activity = {
      id: crypto.randomBytes(8).toString("hex"),
      date: session.start_time || session.timestamp || new Date().toISOString(),
      type: mapSportType(session.sport || data.sport),
      distance: parseFloat((session.total_distance || 0).toFixed(2)),
      duration: Math.round(
        session.total_elapsed_time || session.total_timer_time || 0,
      ),
      calories: Math.round(session.total_calories || 0) || undefined,
      averageHeartRate: Math.round(session.avg_heart_rate || 0) || undefined,
      maxHeartRate: Math.round(session.max_heart_rate || 0) || undefined,
      averagePace: averagePace ? parseFloat(averagePace.toFixed(2)) : undefined,
      elevation: Math.round(session.total_ascent || 0) || undefined,
    };

    // Remove undefined values
    Object.keys(activity).forEach(
      (key) => activity[key] === undefined && delete activity[key],
    );

    // Write to JSON file
    const output = outputFile || inputFile.replace(/\.fit$/i, "-activity.json");
    fs.writeFileSync(output, JSON.stringify(activity, null, 2));

    console.log(`✓ Converted ${path.basename(inputFile)} to activity JSON`);
    console.log(`  Output: ${output}`);
    console.log(`  Type: ${activity.type}`);
    console.log(`  Distance: ${activity.distance} km`);
    console.log(
      `  Duration: ${Math.floor(activity.duration / 60)}m ${activity.duration % 60}s`,
    );
    if (activity.calories) console.log(`  Calories: ${activity.calories}`);
    if (activity.averagePace)
      console.log(`  Avg Pace: ${activity.averagePace.toFixed(2)} min/km`);

    console.log("\nTo add to your activities:");
    console.log("1. Copy the JSON content from the output file");
    console.log("2. Add it to src/data/garminActivities.json array");
  });
}

// CLI usage
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Convert Garmin FIT files to activity JSON format");
    console.log("");
    console.log(
      "Usage: node fit-to-activity-json.js <fit-file-path> [output-path]",
    );
    console.log("");
    console.log("Examples:");
    console.log(
      "  node scripts/fit-to-activity-json.js downloads/activity.fit",
    );
    console.log(
      "  node scripts/fit-to-activity-json.js activity.fit my-activity.json",
    );
    console.log("");
    process.exit(0);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  convertFitToActivity(inputFile, outputFile);
}

export default convertFitToActivity;

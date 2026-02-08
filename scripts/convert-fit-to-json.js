const FitParser = require("fit-file-parser").default;
const fs = require("fs");
const path = require("path");

/**
 * Convert Garmin FIT files to JSON format
 * Usage: node scripts/convert-fit-to-json.js <fit-file-path> [output-path]
 */

function convertFitToJson(inputFile, outputFile) {
  const fitParser = new FitParser({
    force: true,
    speedUnit: "km/h",
    lengthUnit: "km",
    temperatureUnit: "celsius",
    elapsedRecordField: true,
    mode: "both",
  });

  // Read the FIT file
  const content = fs.readFileSync(inputFile);

  fitParser.parse(content, (error, data) => {
    if (error) {
      console.error("Error parsing FIT file:", error);
      process.exit(1);
    }

    // Extract useful activity data
    const activityData = {
      activity: data.activity,
      sessions: data.sessions,
      records: data.records,
      laps: data.laps,
      sport: data.sport,
      device_info: data.device_info,
    };

    // Write to JSON file
    const output = outputFile || inputFile.replace(/\.fit$/i, ".json");
    fs.writeFileSync(output, JSON.stringify(activityData, null, 2));

    console.log(`✓ Converted ${inputFile} to ${output}`);
    console.log(`  Activity type: ${data.sport || "Unknown"}`);
    console.log(`  Records: ${data.records ? data.records.length : 0}`);
    console.log(`  Sessions: ${data.sessions ? data.sessions.length : 0}`);
  });
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      "Usage: node convert-fit-to-json.js <fit-file-path> [output-path]",
    );
    console.log(
      "Example: node convert-fit-to-json.js activity.fit activity.json",
    );
    process.exit(0);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  convertFitToJson(inputFile, outputFile);
}

module.exports = convertFitToJson;
